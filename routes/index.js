var express = require('express');
var router = express.Router();
const {mongoose} = require('mongoose');
const {dbUrl} = require('../Config/dbconfig');
var {productModel} = require('../schema/productSchema');

mongoose.connect(dbUrl,{ useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Failed to connect to MongoDB', err));



router.get('/', async (req, res) => {
  try {
    const products = await productModel.find({});
    res.send({statusCode:200, products, message:"All Properties Fetched"})
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
});

router.get('/random', async (req, res) => {
  try {
    const randomproducts = await productModel.aggregate([{ $sample: { size: 4 } }]);
    res.send({statusCode:200, randomproducts, message:"Products Fetched"})
  } catch (error) {
    res.send({statusCode:500, error,  message:"Error fetching random products"})
  }
});

router.get('/category/:category', async (req, res) => {
  const category = req.params.category;

  try {
    const products = await productModel.find({ category });
    res.send({ statusCode: 200, products, message: "Products Fetched" });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
});


router.post('/addproducts', async (req, res) => {
  const { title, description, image, price, category, quantity } = req.body;

  if (!title || !image || !price || !quantity) {
    return res.send({statusCode:400, message:"Please provide all required fields"});
    
  }

  try {
    const newProduct = new productModel({
      title,
      description,
      image,
      price,
      category,
      quantity,
    });

    const savedProduct = await newProduct.save();
    res.send({statusCode:200, savedProduct, message:"Product saved Successfully"})
  } catch (error) {
    res.send({statusCode:500, error, message:"Something went wrong"})
  }
});

router.get('/products/search', async (req, res) => {
  const searchQuery = req.query.name;

  if (!searchQuery) {
    return res.send({statusCode:400, message:"Search query is required"});    
  }

  try {
    const products = await productModel.find({
      title: { $regex: searchQuery, $options: 'i' },
    });

    if (products.length === 0) {
      return res.send({statusCode:400, message:"No products found"});
    }

    res.json(products);
  } catch (error) {
    res.send({statusCode:500, error, message:"Error searching products"});
  }
});

router.get('/products/filter', async (req, res) => {
  const category = req.query.category;

  if (!category) {
    return res.status(400).json({ message: 'Category is required' });
  }

  try {
    const products = await productModel.find({ category });
    
    if (products.length === 0) {
      return res.status(404).json({ message: 'No products found for this category' });
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error filtering products' });
  }
});

module.exports = router;
