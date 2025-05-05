const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const { Schema } = require("mongoose");
const bcrypt = require("bcrypt");

app.use(express.json());
app.use(cors());

// Database connection
mongoose.connect("mongodb+srv://revatisingh29:r2926evati@ecom.zsuwqxt.mongodb.net/?retryWrites=true&w=majority&appName=ECom");

// Ensure the 'upload/images' directory exists
const uploadDir = path.join(__dirname, 'upload', 'images');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Image Storage Engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage: storage });

app.use('/images', express.static('upload/images'));

// API to upload image
app.post("/upload", upload.single('product'), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`
  });
});

// Product schema and model
const Product = mongoose.model("Product", {
  id: { type: Number, required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  new_price: { type: Number, required: true },
  old_price: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  available: { type: Boolean, default: true },
});

// Add product
app.post('/addproduct', async (req, res) => {
  let products = await Product.find({});
  let id = products.length > 0 ? products[products.length - 1].id + 1 : 1;

  const prod = new Product({
    id,
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
  });

  try {
    const savedProduct = await prod.save();
    console.log(savedProduct);
    res.status(201).json({ success: true, product: savedProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Could not save product" });
  }
});

// Remove product
app.post('/removeproduct', async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  console.log("Product Removed");
  res.json({ success: true, name: req.body.name });
});

// Get all products
app.get('/allproducts', async (req, res) => {
  let products = await Product.find({});
  console.log("All Products Fetched");
  res.send(products);
});

// User model
const Users = mongoose.model("Users", {
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cartData: { type: Schema.Types.Mixed },
  date: { type: Date, default: Date.now },
});

// Signup
app.post('/signup', async (req, res) => {
  try {
    let check = await Users.findOne({ email: req.body.email });
    if (check) {
      return res.status(400).json({ success: false, error: 'Existing user found' });
    }

    let cart = {};
    for (let index = 0; index < 300; index++) {
      cart[index] = 0;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new Users({
      name: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      cartData: cart,
    });

    await user.save();

    const data = { user: { id: user._id } };
    const token = jwt.sign(data, 'revaecom');
    res.json({ success: true, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Error saving user' });
  }
});

// Login
app.post('/login', async (req, res) => {
  let user = await Users.findOne({ email: req.body.email });

  if (user) {
    const passComp = await bcrypt.compare(req.body.password, user.password);

    if (passComp) {
      const data = { user: { id: user._id } };
      const token = jwt.sign(data, 'revaecom');
      res.json({ success: true, token });
    } else {
      res.json({ success: false, errors: "wrong password" });
    }
  } else {
    res.json({ success: false, errors: "wrong email id" });
  }
});
//creating ep for new collection
app.get('/newcollections', async (req, res) => {
  try {
    let products = await Product.find({});
    
    // Get all products except the first one and take the last 8
    let newc = products.slice(1);  // Skip the first product
    newc = newc.slice(-8);         // Take the last 8 products from the remaining array

    res.send(newc);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});
//popular in women
app.get('/popularinwomen',async (req,res)=>{
  let products= await Product.find({category:"women"});
  let popular=products.slice(0,4);
 res.send(popular);
}
)
// Middleware to fetch user
const fetchUser = async (req, res, next) => {
  const token = req.header('auth-token');
  if (!token) {
    return res.status(401).send({ errors: "Please authenticate using a valid token" });
  }

  try {
    const data = jwt.verify(token, 'revaecom');
    req.user = data.user;
    next();
  } catch (error) {
    return res.status(401).send({ errors: "Invalid token" });
  }
};

// Add to cart
app.post('/addtocart', fetchUser, async (req, res) => {
  try {
    const itemId = req.body.itemId;

    let userData = await Users.findOne({ _id: req.user.id });

    if (!userData.cartData) {
      userData.cartData = {};
    }

    // Increment quantity
    const newQty = (userData.cartData[itemId])

    // Update only the item
    await Users.updateOne(
      { _id: req.user.id },
      { $set: { [`cartData.${itemId}`]: newQty } }
    );

    res.json({ success: true, message: "Item added to cart" });
  } catch (err) {
    console.error("Add to cart error:", err.message);
    res.status(500).send("Internal Server Error");
  }
});
//to remove
app.post('/removefromcart',fetchUser,async(req,res)=>{

let userData= await Users.findOne({_id:req.user.id});
if(userData.cartData[req.body.itemId]>0)
userData.cartData[req.body.itemId]-=1;
await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData});
res.send("deleted");
})
//creating ep to display
app.post('/getcart',fetchUser,async (req,res)=>{
  console.log("get cart");
  let userData= await Users.findOne({_id:req.user.id});
  res.json(userData.cartData);

})
app.listen(port, (error) => {
  if (!error) {
    console.log("Server running on " + port);
  } else {
    console.log("Error: " + error);
  }
});


