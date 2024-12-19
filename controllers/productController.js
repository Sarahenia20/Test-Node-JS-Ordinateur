const Product = require("../models/Product");

exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).send(product);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.getProducts = async (req, res) => {
  const products = await Product.find();
  res.send(products);
};

exports.getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).send("Product not found");
  res.send(product);
};

exports.updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.send(product);
};

exports.deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.send({ message: "Product deleted" });
};
exports.searchProductByName = async (req, res) => {
  try {
    const { name } = req.query; // Extract name from query parameters
    const products = await Product.find({ name: new RegExp(name, "i") }); // Case-insensitive
    res.json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
