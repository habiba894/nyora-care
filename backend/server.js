
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Product = require("./models/Product");
const Order = require("./models/Order");
const Admin = require("./models/Admin");
const { requireAdmin } = require("./middleware");

const app = express();

const PORT = process.env.PORT || 5000;
const DELIVERY_FEE = 50;

const ORDER_TRANSITIONS = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered", "failed"],
  delivered: [],
  failed: ["cancelled"],
  cancelled: []
};

const ALLOWED_PAYMENT_STATUSES = ["paid"];
const RESET_CONFIRMATION = "DELETE_ALL_TEST_ORDERS";

app.use(cors());
app.use(express.json({ limit: "1mb" }));

// ==========================================
// DATABASE CONNECTION
// ==========================================

let dbConnectionPromise = null;

async function connectDatabase() {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing.");
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing.");
  }

  if (!dbConnectionPromise) {
    dbConnectionPromise = mongoose
      .connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 10000
      })
      .then(async () => {
        console.log("MongoDB connected successfully!");
        console.log("MongoDB database:", mongoose.connection.name);

        const adminEmail = process.env.ADMIN_EMAIL
          ?.trim()
          .toLowerCase();

        if (!adminEmail) {
          throw new Error("ADMIN_EMAIL is missing.");
        }

        let admin = await Admin.findOne({
          email: adminEmail
        });

        if (!admin) {
          if (!process.env.ADMIN_PASSWORD) {
            throw new Error(
              "ADMIN_PASSWORD is required to create the admin account."
            );
          }

          const hashedPassword = await bcrypt.hash(
            process.env.ADMIN_PASSWORD,
            12
          );

          admin = await Admin.create({
            name: process.env.ADMIN_NAME?.trim() || "Habiba",
            email: adminEmail,
            password: hashedPassword,
            role: "admin"
          });

          console.log("[ADMIN] Admin account created.");
        } else if (admin.role !== "admin") {
          admin.role = "admin";
          await admin.save();

          console.log("[ADMIN] Existing admin role updated.");
        } else {
          console.log("[ADMIN] Admin account already exists.");
        }
      })
      .catch(error => {
        dbConnectionPromise = null;
        throw error;
      });
  }

  await dbConnectionPromise;
}

// IMPORTANT:
// Connect to MongoDB BEFORE all API routes.
// This is required for Vercel serverless requests.

app.use(async (req, res, next) => {
  try {
    await connectDatabase();
    next();
  } catch (error) {
    console.error("[DATABASE] Connection error:", error.message);

    return res.status(503).json({
      success: false,
      message: "Database connection failed. Please try again."
    });
  }
});

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function normalizeStatus(value) {
  return typeof value === "string"
    ? value.trim().toLowerCase()
    : "";
}

function escapeHtml(value = "") {
  const entities = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };

  return String(value).replace(
    /[&<>"']/g,
    character => entities[character]
  );
}

function getPaymentMethod(order) {
  const value = order?.payment ?? order?.paymentMethod;

  if (typeof value === "string") {
    const method = value.trim().toLowerCase();

    if (
      ["cod", "cash_on_delivery", "cash on delivery"].includes(method)
    ) {
      return "cod";
    }

    if (["instapay", "insta_pay", "insta pay"].includes(method)) {
      return "instapay";
    }

    return method;
  }

  if (value && typeof value === "object") {
    return getPaymentMethod({
      payment: value.method ?? value.type ?? value.name
    });
  }

  return "";
}

// ==========================================
// EMAIL CONFIGURATION
// ==========================================

const emailConfigured = Boolean(
  process.env.SMTP_HOST?.trim() &&
  process.env.SMTP_PORT?.trim() &&
  process.env.SMTP_USER?.trim() &&
  process.env.SMTP_PASS?.trim() &&
  process.env.ORDER_NOTIFICATION_EMAIL?.trim()
);

const smtpUser = process.env.SMTP_USER?.trim();

const smtpPass = process.env.SMTP_PASS
  ?.trim()
  .replace(/\s+/g, "");

const smtpPort = Number(process.env.SMTP_PORT);

const emailTransporter = emailConfigured
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST.trim(),
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass
      },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 20000
    })
  : null;

// ==========================================
// SEND ORDER EMAIL
// ==========================================

async function sendOrderNotification(order) {
  if (!emailTransporter) {
    throw new Error(
      "Email settings are missing. Check environment variables."
    );
  }

  const itemsText = (order.items || [])
    .map(
      item => `${item.name} x ${item.qty} - EGP ${item.lineTotal}`
    )
    .join("\n");

  const itemsHtml = (order.items || [])
    .map(
      item =>
        `<li>${escapeHtml(item.name)} × ${item.qty} — EGP ${item.lineTotal}</li>`
    )
    .join("");

  const paymentMethod = getPaymentMethod(order);

  const paymentLabel =
    paymentMethod === "instapay"
      ? "InstaPay"
      : paymentMethod === "cod"
        ? "Cash on Delivery"
        : paymentMethod || "Unknown";

  await emailTransporter.sendMail({
    from:
      process.env.SMTP_FROM?.trim() ||
      `Nyora Beauty <${smtpUser}>`,

    to: process.env.ORDER_NOTIFICATION_EMAIL.trim(),

    subject: `Nyora Beauty - New Order ${order.orderNumber}`,

    text: `
New order received - Nyora Beauty

Order number: ${order.orderNumber}

Customer: ${order.customer.fullName}
Email: ${order.customer.email}
Phone: ${order.customer.phone}

Governorate: ${order.customer.governorate}
City: ${order.customer.city}
Address: ${order.customer.address}
Apartment: ${order.customer.apartment || "Not provided"}
Customer note: ${order.orderNote || "None"}

Items:
${itemsText}

Subtotal: EGP ${order.subtotal}
Delivery: EGP ${order.delivery}
Total: EGP ${order.total}

Payment method: ${paymentLabel}
Payment status: ${order.paymentStatus}
Order status: ${order.status}

Important: Verify an InstaPay transfer independently before confirming payment.
`,

    html: `
      <div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;color:#49343b;line-height:1.7">

        <h2>New order received - Nyora Beauty</h2>

        <p>
          <strong>Order number:</strong>
          ${escapeHtml(order.orderNumber)}
        </p>

        <h3>Customer details</h3>

        <p>
          <strong>Name:</strong> ${escapeHtml(order.customer.fullName)}<br>
          <strong>Email:</strong> ${escapeHtml(order.customer.email)}<br>
          <strong>Phone:</strong> ${escapeHtml(order.customer.phone)}<br>
          <strong>Governorate:</strong> ${escapeHtml(order.customer.governorate)}<br>
          <strong>City:</strong> ${escapeHtml(order.customer.city)}<br>
          <strong>Address:</strong> ${escapeHtml(order.customer.address)}<br>
          <strong>Apartment:</strong> ${escapeHtml(order.customer.apartment || "Not provided")}<br>
          <strong>Customer note:</strong> ${escapeHtml(order.orderNote || "None")}
        </p>

        <h3>Order items</h3>

        <ul>${itemsHtml}</ul>

        <p>
          Subtotal: EGP ${order.subtotal}<br>
          Delivery: EGP ${order.delivery}<br>
          <strong>Total: EGP ${order.total}</strong>
        </p>

        <p>
          <strong>Payment method:</strong> ${escapeHtml(paymentLabel)}<br>
          <strong>Payment status:</strong> ${escapeHtml(order.paymentStatus)}<br>
          <strong>Order status:</strong> ${escapeHtml(order.status)}
        </p>

        <p>Verify an InstaPay transfer independently before confirming payment.</p>

      </div>
    `
  });

  console.log(
    `[EMAIL] Order notification sent: ${order.orderNumber}`
  );
}

// ==========================================
// HOME
// ==========================================

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Welcome to Nyora Beauty API!"
  });
});

// ==========================================
// ADMIN LOGIN
// ==========================================

app.post("/api/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required."
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "Authentication is not configured."
      });
    }

    const admin = await Admin.findOne({
      email: email.trim().toLowerCase()
    }).select("+password");

    if (
      !admin ||
      !(await bcrypt.compare(password, admin.password))
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    const token = jwt.sign(
      {
        adminId: admin._id.toString(),
        role: admin.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error("Admin login error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to log in right now."
    });
  }
});

// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/api/health", (req, res) => {
  return res.status(200).json({
    success: true,
    status: "Server is running",
    database:
      mongoose.connection.readyState === 1
        ? "Connected"
        : "Disconnected"
  });
});

// ==========================================
// GET ALL PRODUCTS
// ==========================================

app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find().sort({
      createdAt: -1
    });

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error("Get products error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch products."
    });
  }
});

// ==========================================
// GET ONE PRODUCT
// ==========================================

app.get("/api/products/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID."
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found."
      });
    }

    return res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error("Get product error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch product."
    });
  }
});

// ==========================================
// ADD PRODUCT — ADMIN ONLY
// ==========================================

app.post("/api/products", requireAdmin, async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      price,
      image,
      category,
      inStock,
      stockQuantity,
      featured
    } = req.body || {};

    const product = await Product.create({
      name,
      slug,
      description,
      price,
      image,
      category,
      inStock,
      stockQuantity:
        stockQuantity === undefined || stockQuantity === ""
          ? null
          : Number(stockQuantity),
      featured
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully.",
      data: product
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A product with this slug already exists."
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    console.error("Create product error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to create product."
    });
  }
});

// ==========================================
// UPDATE PRODUCT — ADMIN ONLY
// ==========================================

app.patch("/api/products/:id", requireAdmin, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID."
      });
    }

    const allowedFields = [
      "name",
      "slug",
      "description",
      "price",
      "image",
      "category",
      "inStock",
      "stockQuantity",
      "featured"
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body?.[field] !== undefined) {
        updates[field] =
          field === "stockQuantity"
            ? (
                req.body[field] === "" || req.body[field] === null
                  ? null
                  : Number(req.body[field])
              )
            : req.body[field];
      }
    }

    if (
      updates.stockQuantity !== undefined &&
      updates.stockQuantity !== null &&
      (
        !Number.isInteger(updates.stockQuantity) ||
        updates.stockQuantity < 0
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Stock quantity must be a non-negative integer or null."
      });
    }

    if (updates.stockQuantity === 0) {
      updates.inStock = false;
    }

    if (updates.stockQuantity > 0) {
      updates.inStock = true;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided."
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      data: product
    });
  } catch (error) {
    console.error("Update product error:", error.message);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update product."
    });
  }
});

// ==========================================
// ADMIN: GET ALL ORDERS
// ==========================================

app.get("/api/admin/orders", requireAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error("Get admin orders error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders."
    });
  }
});

// ==========================================
// ADMIN: DELETE TEST ORDERS
// ==========================================

app.post(
  "/api/admin/orders/reset-test-orders",
  requireAdmin,
  async (req, res) => {
    let session;

    try {
      const { confirmation, expectedCount } = req.body || {};

      if (confirmation !== RESET_CONFIRMATION) {
        return res.status(400).json({
          success: false,
          message: "Confirmation phrase is missing or incorrect."
        });
      }

      if (
        !Number.isInteger(expectedCount) ||
        expectedCount < 0
      ) {
        return res.status(400).json({
          success: false,
          message: "A valid expected order count is required."
        });
      }

      session = await mongoose.startSession();

      let deletedCount = 0;

      await session.withTransaction(async () => {
        const orders = await Order.find({})
          .session(session);

        if (orders.length !== expectedCount) {
          const error = new Error("ORDER_COUNT_MISMATCH");
          error.actualCount = orders.length;
          throw error;
        }

        for (const order of orders) {
          if (
            order.stockReserved !== true ||
            order.stockRestored === true
          ) {
            continue;
          }

          const quantities = new Map();

          for (const item of order.items || []) {
            const productId = String(item.product);
            const qty = Number(item.qty);

            if (
              !mongoose.isValidObjectId(productId) ||
              !Number.isInteger(qty) ||
              qty < 1
            ) {
              throw new Error(
                `INVALID_RESERVED_ORDER_ITEM:${order._id}`
              );
            }

            quantities.set(
              productId,
              (quantities.get(productId) || 0) + qty
            );
          }

          for (const [productId, qty] of quantities) {
            await Product.updateOne(
              {
                _id: productId,
                stockQuantity: {
                  $exists: true,
                  $ne: null
                }
              },
              {
                $inc: {
                  stockQuantity: qty
                },
                $set: {
                  inStock: true
                }
              },
              { session }
            );
          }
        }

        const deleteResult = await Order.deleteMany({})
          .session(session);

        deletedCount = deleteResult.deletedCount || 0;
      });

      return res.status(200).json({
        success: true,
        message: "Orders were deleted successfully.",
        deletedCount
      });
    } catch (error) {
      if (error.message === "ORDER_COUNT_MISMATCH") {
        return res.status(409).json({
          success: false,
          message:
            "The order count changed. Refresh the orders list and try again.",
          expectedCount: req.body?.expectedCount,
          actualCount: error.actualCount
        });
      }

      if (
        error.message?.startsWith(
          "INVALID_RESERVED_ORDER_ITEM:"
        )
      ) {
        console.error("Reset orders stopped:", error.message);

        return res.status(409).json({
          success: false,
          message:
            "A reserved order contains invalid product information. No orders were deleted."
        });
      }

      console.error("Reset test orders error:", error);

      const errorMessage = String(error.message || "");

      if (
        errorMessage.includes("Transaction numbers are only allowed") ||
        errorMessage.includes("replica set") ||
        errorMessage.includes("Transaction is not supported")
      ) {
        return res.status(503).json({
          success: false,
          message:
            "MongoDB transactions are not supported by the current database setup. Configure MongoDB as a replica set before retrying."
        });
      }

      return res.status(500).json({
        success: false,
        message:
          "Failed to reset orders. Check the backend logs."
      });
    } finally {
      if (session) {
        await session.endSession();
      }
    }
  }
);

// ==========================================
// ADMIN: UPDATE ORDER STATUS
// ==========================================

app.patch(
  "/api/admin/orders/:id/status",
  requireAdmin,
  async (req, res) => {
    let session;
    let operationError = null;

    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid order ID."
        });
      }

      const rawStatus = req.body?.status;
      const status = normalizeStatus(rawStatus);
      const allowedStatuses = Object.keys(ORDER_TRANSITIONS);

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid order status.",
          receivedStatus: rawStatus ?? null,
          allowedStatuses
        });
      }

      session = await mongoose.startSession();

      let updatedOrder = null;

      await session.withTransaction(async () => {
        operationError = null;
        updatedOrder = null;

        const order = await Order.findById(req.params.id)
          .session(session);

        if (!order) {
          operationError = {
            status: 404,
            message: "Order not found."
          };
          return;
        }

        const currentStatus = normalizeStatus(order.status);

        if (!ORDER_TRANSITIONS[currentStatus]) {
          operationError = {
            status: 409,
            message: `The order has an unsupported current status: ${currentStatus || "missing"}.`
          };
          return;
        }

        if (
          currentStatus === "cancelled" &&
          status !== "cancelled"
        ) {
          operationError = {
            status: 409,
            message:
              "A cancelled order cannot be reactivated. Create a new order instead."
          };
          return;
        }

        if (currentStatus === status) {
          updatedOrder = order;
          return;
        }

        const allowedNext = ORDER_TRANSITIONS[currentStatus];

        if (!allowedNext.includes(status)) {
          operationError = {
            status: 409,
            message: `An order cannot move from ${currentStatus} to ${status}.`
          };
          return;
        }

        const shouldReserveStock =
          status === "confirmed" && !order.stockReserved;

        const shouldRestoreStock =
          status === "cancelled" &&
          order.stockReserved &&
          !order.stockRestored;

        // Reserve stock when order is confirmed.

        if (shouldReserveStock) {
          const requested = new Map();

          for (const item of order.items || []) {
            const productId = String(item.product);
            const qty = Number(item.qty);

            if (
              !mongoose.isValidObjectId(productId) ||
              !Number.isInteger(qty) ||
              qty < 1
            ) {
              operationError = {
                status: 409,
                message:
                  "The order contains an invalid product or quantity."
              };

              throw new Error("ORDER_STOCK_OPERATION_ABORT");
            }

            requested.set(
              productId,
              (requested.get(productId) || 0) + qty
            );
          }

          for (const [productId, qty] of requested) {
            const product = await Product.findById(productId)
              .session(session);

            if (!product) {
              operationError = {
                status: 409,
                message:
                  `Product for this order no longer exists (ID: ${productId}).`
              };

              throw new Error("ORDER_STOCK_OPERATION_ABORT");
            }

            if (
              product.stockQuantity === null ||
              product.stockQuantity === undefined
            ) {
              if (!product.inStock) {
                operationError = {
                  status: 409,
                  message: `${product.name} is currently unavailable.`
                };

                throw new Error("ORDER_STOCK_OPERATION_ABORT");
              }

              continue;
            }

            const result = await Product.updateOne(
              {
                _id: product._id,
                inStock: true,
                stockQuantity: { $gte: qty }
              },
              {
                $inc: {
                  stockQuantity: -qty
                }
              },
              { session }
            );

            if (result.modifiedCount !== 1) {
              operationError = {
                status: 409,
                message:
                  `Not enough stock for ${product.name}. Available stock may have changed.`
              };

              throw new Error("ORDER_STOCK_OPERATION_ABORT");
            }

            await Product.updateOne(
              {
                _id: product._id,
                stockQuantity: 0
              },
              {
                $set: {
                  inStock: false
                }
              },
              { session }
            );
          }

          order.stockReserved = true;
          order.stockRestored = false;
        }

        // Restore stock when a reserved order is cancelled.

        if (shouldRestoreStock) {
          const requested = new Map();

          for (const item of order.items || []) {
            const productId = String(item.product);
            const qty = Number(item.qty);

            if (
              !mongoose.isValidObjectId(productId) ||
              !Number.isInteger(qty) ||
              qty < 1
            ) {
              operationError = {
                status: 409,
                message:
                  "The order contains an invalid product or quantity."
              };

              throw new Error("ORDER_STOCK_OPERATION_ABORT");
            }

            requested.set(
              productId,
              (requested.get(productId) || 0) + qty
            );
          }

          for (const [productId, qty] of requested) {
            await Product.updateOne(
              {
                _id: productId,
                stockQuantity: {
                  $exists: true,
                  $ne: null
                }
              },
              {
                $inc: {
                  stockQuantity: qty
                },
                $set: {
                  inStock: true
                }
              },
              { session }
            );
          }

          order.stockRestored = true;
        }

        order.status = status;

        if (!order.shipping) {
          order.shipping = {};
        }

        if (status === "shipped" && !order.shipping.shippedAt) {
          order.shipping.shippedAt = new Date();
        }

        if (status === "delivered") {
          if (!order.shipping.deliveredAt) {
            order.shipping.deliveredAt = new Date();
          }

          order.shipping.status = "delivered";
        }

        await order.save({ session });

        updatedOrder = order;
      });

      if (operationError) {
        return res.status(operationError.status).json({
          success: false,
          message: operationError.message
        });
      }

      return res.status(200).json({
        success: true,
        message: "Order status and stock updated successfully.",
        data: updatedOrder
      });
    } catch (error) {
      if (error.message === "ORDER_STOCK_OPERATION_ABORT") {
        return res.status(operationError?.status || 409).json({
          success: false,
          message:
            operationError?.message ||
            "Stock could not be updated. Please refresh the order and try again."
        });
      }

      console.error("Update order status error:", error);

      return res.status(500).json({
        success: false,
        message:
          "Failed to update order status. Check the backend logs."
      });
    } finally {
      if (session) {
        await session.endSession();
      }
    }
  }
);

// ==========================================
// ADMIN: CONFIRM ORDER PAYMENT
// ==========================================

app.patch(
  "/api/admin/orders/:id/payment",
  requireAdmin,
  async (req, res) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid order ID."
        });
      }

      const paymentStatus = normalizeStatus(
        req.body?.paymentStatus
      );

      if (!ALLOWED_PAYMENT_STATUSES.includes(paymentStatus)) {
        return res.status(400).json({
          success: false,
          message: "Invalid payment status.",
          receivedPaymentStatus:
            req.body?.paymentStatus ?? null,
          allowedPaymentStatuses: ALLOWED_PAYMENT_STATUSES
        });
      }

      const order = await Order.findById(req.params.id);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found."
        });
      }

      const status = normalizeStatus(order.status);
      const method = getPaymentMethod(order);
      const currentPaymentStatus = normalizeStatus(
        order.paymentStatus
      );

      if (status === "cancelled") {
        return res.status(409).json({
          success: false,
          message:
            "Cannot confirm payment for a cancelled order. Verify the refund separately."
        });
      }

      if (currentPaymentStatus === "paid") {
        return res.status(200).json({
          success: true,
          message: "Payment was already confirmed.",
          data: order
        });
      }

      if (method === "cod" && status !== "delivered") {
        return res.status(409).json({
          success: false,
          message:
            "Cash on delivery payment can be confirmed only after delivery."
        });
      }

      if (
        method === "instapay" &&
        ![
          "confirmed",
          "processing",
          "shipped",
          "delivered"
        ].includes(status)
      ) {
        return res.status(409).json({
          success: false,
          message:
            "Confirm the order first before confirming the InstaPay payment."
        });
      }

      if (!["cod", "instapay"].includes(method)) {
        return res.status(409).json({
          success: false,
          message:
            "Unknown payment method. Check the order before confirming payment."
        });
      }

      order.paymentStatus = "paid";

      await order.save();

      return res.status(200).json({
        success: true,
        message: "Payment confirmed successfully.",
        data: order
      });
    } catch (error) {
      console.error("Confirm payment error:", error.message);

      return res.status(500).json({
        success: false,
        message: "Failed to confirm payment."
      });
    }
  }
);

// ==========================================
// ADMIN: STORE ANALYTICS
// ==========================================

app.get("/api/admin/analytics", requireAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .select("total status paymentStatus createdAt")
      .lean();

    const productsCount = await Product.countDocuments();

    const currentYear = new Date().getFullYear();

    const monthly = Array.from(
      { length: 12 },
      (_, index) => ({
        month: new Date(
          currentYear,
          index,
          1
        ).toLocaleString("en", {
          month: "short"
        }),
        revenue: 0,
        orders: 0
      })
    );

    let revenue = 0;
    let pendingOrders = 0;
    let completedOrders = 0;

    for (const order of orders) {
      const status = normalizeStatus(order.status);
      const paymentStatus = normalizeStatus(
        order.paymentStatus
      );

      if (status === "pending") {
        pendingOrders += 1;
      }

      if (status === "delivered") {
        completedOrders += 1;
      }

      if (paymentStatus === "paid") {
        revenue += Number(order.total) || 0;
      }

      if (order.createdAt) {
        const date = new Date(order.createdAt);

        if (
          !Number.isNaN(date.getTime()) &&
          date.getFullYear() === currentYear
        ) {
          const monthIndex = date.getMonth();

          monthly[monthIndex].orders += 1;

          if (paymentStatus === "paid") {
            monthly[monthIndex].revenue +=
              Number(order.total) || 0;
          }
        }
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        productsCount,
        totalOrders: orders.length,
        pendingOrders,
        completedOrders,
        revenue,
        monthly
      }
    });
  } catch (error) {
    console.error("Admin analytics error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to calculate analytics."
    });
  }
});

// ==========================================
// CREATE ORDER — CUSTOMER CHECKOUT
// ==========================================

app.post("/api/orders", async (req, res) => {
  console.log("[CREATE ORDER] Request received");

  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: "Database is not connected. Please try again."
      });
    }

    const {
      customer,
      items,
      payment,
      orderNote
    } = req.body || {};

    if (
      !customer ||
      typeof customer.fullName !== "string" ||
      !customer.fullName.trim() ||
      typeof customer.email !== "string" ||
      !customer.email.trim() ||
      typeof customer.phone !== "string" ||
      !customer.phone.trim() ||
      typeof customer.governorate !== "string" ||
      !customer.governorate.trim() ||
      typeof customer.city !== "string" ||
      !customer.city.trim() ||
      typeof customer.address !== "string" ||
      !customer.address.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Please complete all required customer details."
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty."
      });
    }

    if (!["cod", "instapay"].includes(payment)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method."
      });
    }

    for (const item of items) {
      const qty = Number(item?.qty);

      if (
        !item?.id ||
        !Number.isInteger(qty) ||
        qty < 1
      ) {
        return res.status(400).json({
          success: false,
          message: "One or more order items are invalid."
        });
      }

      if (!mongoose.isValidObjectId(String(item.id))) {
        return res.status(400).json({
          success: false,
          message: "Invalid product ID in your cart."
        });
      }
    }

    const productIds = [
      ...new Set(items.map(item => String(item.id)))
    ];

    const databaseProducts = await Product.find({
      _id: { $in: productIds }
    });

    const productMap = new Map(
      databaseProducts.map(product => [
        String(product._id),
        product
      ])
    );

    const orderItems = [];
    const requestedQuantities = new Map();

    for (const item of items) {
      const productId = String(item.id);

      requestedQuantities.set(
        productId,
        (requestedQuantities.get(productId) || 0) +
          Number(item.qty)
      );
    }

    for (const [productId, requestedQty] of requestedQuantities) {
      const product = productMap.get(productId);

      if (!product) {
        return res.status(400).json({
          success: false,
          message:
            "A product in your cart no longer exists. Please refresh your cart."
        });
      }

      if (!product.inStock) {
        return res.status(409).json({
          success: false,
          message: `${product.name} is currently unavailable.`
        });
      }

      if (
        product.stockQuantity !== null &&
        product.stockQuantity !== undefined &&
        product.stockQuantity < requestedQty
      ) {
        return res.status(409).json({
          success: false,
          message:
            `Not enough stock for ${product.name}. Available quantity: ${product.stockQuantity}.`
        });
      }
    }

    for (const item of items) {
      const product = productMap.get(String(item.id));

      if (!product) {
        return res.status(400).json({
          success: false,
          message:
            "A product in your cart no longer exists. Please refresh your cart."
        });
      }

      const qty = Number(item.qty);
      const price = Number(product.price);

      if (!product.inStock) {
        return res.status(409).json({
          success: false,
          message: `${product.name} is currently unavailable.`
        });
      }

      if (!Number.isFinite(price) || price < 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid price for ${product.name}.`
        });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        price,
        image: product.image || "",
        category: product.category || "General",
        size: typeof item.size === "string" ? item.size : "",
        qty,
        lineTotal: price * qty
      });
    }

    const subtotal = orderItems.reduce(
      (sum, item) => sum + item.lineTotal,
      0
    );

    const delivery = DELIVERY_FEE;
    const total = subtotal + delivery;

    const orderNumber =
      `NYR-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const cleanOrderNote =
      typeof orderNote === "string"
        ? orderNote.trim().slice(0, 500)
        : "";

    const order = await Order.create({
      orderNumber,

      customer: {
        fullName: customer.fullName.trim(),
        email: customer.email.trim(),
        phone: customer.phone.trim(),
        governorate: customer.governorate.trim(),
        city: customer.city.trim(),
        address: customer.address.trim(),

        apartment:
          typeof customer.apartment === "string"
            ? customer.apartment.trim()
            : ""
      },

      orderNote: cleanOrderNote,
      items: orderItems,
      subtotal,
      delivery,
      total,
      payment,

      paymentStatus:
        payment === "cod"
          ? "cash_on_delivery"
          : "pending_payment",

      status: "pending"
    });

    console.log("[CREATE ORDER] Saved successfully");
    console.log("[CREATE ORDER] Order ID:", order._id.toString());
    console.log("[CREATE ORDER] Order number:", order.orderNumber);

    const savedOrder = await Order.findById(order._id).lean();

    if (!savedOrder) {
      console.error(
        "[CREATE ORDER] Verification failed:",
        order._id.toString()
      );

      return res.status(500).json({
        success: false,
        message: "Order verification failed. Please contact support."
      });
    }

    res.status(201).json({
      success: true,
      message: "Order saved successfully.",
      data: savedOrder
    });

    // Email failure does not undo the saved order.

    sendOrderNotification(order).catch(error => {
      console.error(
        `[CREATE ORDER] Order ${order.orderNumber} was saved, but email notification failed.`
      );

      console.error("[EMAIL] Error code:", error.code || "N/A");
      console.error("[EMAIL] SMTP response:", error.responseCode || "N/A");
      console.error("[EMAIL] Error message:", error.message);
    });
  } catch (error) {
    console.error("[CREATE ORDER] Failed to save order:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Duplicate order data. Please try again."
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to save your order. Please try again."
    });
  }
});

// ==========================================
// HANDLE UNKNOWN ROUTES
// ==========================================

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "Route not found."
  });
});

// ==========================================
// LOCAL DEVELOPMENT
// ==========================================

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(
      `Nyora Beauty API is running on port ${PORT}`
    );
  });
}

// ==========================================
// EXPORT EXPRESS APP
// ==========================================

module.exports = app;
