const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const sampleProducts = [
  {
    name: "Apple",
    description: "Fresh red apples, rich in vitamins",
    price: 120,
    category: "fruits",
    stock: 50,
    image: "apple.jpg",
    unit: "kg"
  },
  {
    name: "Banana",
    description: "Organic ripe bananas, natural energy booster",
    price: 40,
    category: "fruits",
    stock: 100,
    image: "banana.jpg",
    unit: "kg"
  },
  {
    name: "Tomato",
    description: "Fresh farm tomatoes",
    price: 30,
    category: "vegetables",
    stock: 80,
    image: "tomato.jpg",
    unit: "kg"
  },
  {
    name: "Potato",
    description: "High-quality potatoes for cooking",
    price: 25,
    category: "vegetables",
    stock: 120,
    image: "potato.jpg",
    unit: "kg"
  },
  {
    name: "Milk",
    description: "Full cream cow milk",
    price: 60,
    category: "dairy",
    stock: 200,
    image: "milk.jpg",
    unit: "liter"
  },
  {
    name: "Cheese",
    description: "Processed cheese slices",
    price: 150,
    category: "dairy",
    stock: 75,
    image: "cheese.jpg",
    unit: "pack"
  },
  {
    name: "Chicken Breast",
    description: "Skinless chicken breast meat",
    price: 250,
    category: "meat",
    stock: 60,
    image: "chicken.jpg",
    unit: "kg"
  },
  {
    name: "Wheat Flour",
    description: "Stone-ground whole wheat flour",
    price: 45,
    category: "grains",
    stock: 150,
    image: "flour.jpg",
    unit: "kg"
  },
  {
    name: "Rice",
    description: "Premium basmati rice",
    price: 90,
    category: "grains",
    stock: 200,
    image: "rice.jpg",
    unit: "kg"
  },
  {
    name: "Coca-Cola",
    description: "Chilled soft drink bottle",
    price: 40,
    category: "beverages",
    stock: 300,
    image: "coke.jpg",
    unit: "liter"
  },
  {
    name: "Potato Chips",
    description: "Crispy salted potato chips",
    price: 20,
    category: "snacks",
    stock: 500,
    image: "chips.jpg",
    unit: "pack"
  },
  {
    name: "Orange Juice",
    description: "Fresh orange juice without preservatives",
    price: 120,
    category: "beverages",
    stock: 90,
    image: "juice.jpg",
    unit: "liter"
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await Product.deleteMany(); // clears old data
    await Product.insertMany(sampleProducts);
    console.log("✅ Sample products added successfully!");
    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error seeding database:", err);
  }
};

seedDB();
