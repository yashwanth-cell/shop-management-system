const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Initialize app
const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost/shop-management', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Schema for product management
const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  stock: Number
});

const Product = mongoose.model('Product', productSchema);

// Routes

// Get all products
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(400).json({ message: 'Error fetching products' });
  }
});

// Add new product
app.post('/products', async (req, res) => {
  const { name, category, price, stock } = req.body;

  const newProduct = new Product({ name, category, price, stock });

  try {
    await newProduct.save();
    res.json({ message: 'Product added successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Error adding product' });
  }
});

// Update product stock
app.put('/products/:id', async (req, res) => {
  const { id } = req.params;
  const { stock } = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, { stock }, { new: true });
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: 'Error updating stock' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
