const { Product, validate } = require("../models/product");
const { Category } = require("../models/category");
const auth = require("../middleware/auth");

const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const products = await Product.find().sort("name");
  res.send(products);
});

router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.param.id);

  if (!product) return res.status(404).send("Product not found");
  res.send(product);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const category = await Category.findById(req.body.categoryId);
  if (!category) return res.status(400).send("Invalid Category");

  const product = new Product({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: {
      _id: category._id,
      name: category.name
    }
  });

  await product.save();
  res.send(product);
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const category = await Category.findById(req.body.categoryId);
  if (!category) return res.status(400).send("Invalid Category");

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: {
        _id: category._id,
        name: category.name
      }
    },
    { new: true }
  );

  if (!product) return res.status(404).send("Product not found.");
  res.send(product);
});

router.delete("/:id", auth, async (req, res) => {
  const product = await Product.findByIdAndRemove(req.params.id);

  if (!product) return res.status(404).send("Product not Found");
  res.send(product);
});

module.exports = router;
