
const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      default: "General",
    },
    size: {
      type: String,
      default: "",
    },
    qty: {
      type: Number,
      required: true,
      min: 1,
    },
    lineTotal: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    customer: {
      fullName: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },
      phone: {
        type: String,
        required: true,
        trim: true,
      },
      governorate: {
        type: String,
        required: true,
        trim: true,
      },
      city: {
        type: String,
        required: true,
        trim: true,
      },
      address: {
        type: String,
        required: true,
        trim: true,
      },
      apartment: {
        type: String,
        default: "",
        trim: true,
      },
    },

    orderNote: {
      type: String,
      trim: true,
      default: "",
      maxlength: 500,
    },

    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (items) => items.length > 0,
        message: "An order must contain at least one item.",
      },
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    delivery: {
      type: Number,
      required: true,
      min: 0,
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },

    payment: {
      type: String,
      enum: ["cod", "instapay"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: [
        "cash_on_delivery",
        "pending_payment",
        "pending",
        "paid",
        "failed",
        "refunded",
      ],
      required: true,
      default: "pending_payment",
    },

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "failed",
        "cancelled",
      ],
      default: "pending",
    },

    shipping: {
      company: {
        type: String,
        trim: true,
        default: "",
      },

      trackingNumber: {
        type: String,
        trim: true,
        default: "",
      },

      trackingUrl: {
        type: String,
        trim: true,
        default: "",
      },

      status: {
        type: String,
        enum: [
          "not_created",
          "pending",
          "confirmed",
          "processing",
          "shipped",
          "delivered",
          "failed",
          "cancelled",
        ],
        default: "pending",
      },

      shippedAt: {
        type: Date,
        default: null,
      },

      deliveredAt: {
        type: Date,
        default: null,
      },
    },

    stockReserved: {
      type: Boolean,
      default: false,
    },

    stockRestored: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Order", orderSchema);
