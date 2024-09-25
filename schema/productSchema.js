const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: String,
  quantity: {
    type: Number,
    required: true,
  },
  });

const productModel = mongoose.model('products', productSchema)

module.exports= {productModel}