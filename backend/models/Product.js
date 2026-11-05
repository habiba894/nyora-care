const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
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
      trim: true,
    },

    inStock: {
      type: Boolean,
      default: true,
    },

    // null means the initial stock quantity has not been set yet.
    stockQuantity: {
      type: Number,
      default: null,
      min: 0,
      validate: {
        validator: (value) =>
          value === null ||
          (Number.isInteger(value) && value >= 0),
        message: "Stock quantity must be a non-negative integer.",
      },
    },

    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
