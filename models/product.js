const Joi = require("joi");
const mongoose = require("mongoose");
const { categorySchema } = require("./category");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 255
  },
  description: {
    type: String,
    required: true,
    maxlength: 2048
  },
  price: {
    type: String,
    required: true,
    maxlength: 10
  },
  category: {
    type: categorySchema,
    required: true
  }
});

const Product = mongoose.model("Product", productSchema);

function validateProduct(product) {
  const schema = {
    name: Joi.string()
      .max(255)
      .required(),
    description: Joi.string()
      .max(2048)
      .required(),
    price: Joi.string()
      .max(10)
      .required(),
    categoryId: Joi.objectId().required()
  };

  return Joi.validate(product, schema);
}

exports.Product = Product;
exports.validate = validateProduct;
