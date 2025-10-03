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
    image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.istockphoto.com%2Fphotos%2Fapple-fruit&psig=AOvVaw2FMgLhxhvbPxZlX5GRaANX&ust=1759576971162000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCOi48JX1h5ADFQAAAAAdAAAAABAE",
    unit: "kg"
  },
  {
    name: "Banana",
    description: "Organic ripe bananas, natural energy booster",
    price: 40,
    category: "fruits",
    stock: 100,
    image: "https://media.istockphoto.com/id/1494763483/photo/banana-concept.jpg?s=612x612&w=is&k=20&c=2BcUioXt7dNw1N2U540k3WDJF9gOwcg6LtXKso7-cTw=",
    unit: "kg"
  },
  {
    name: "Tomato",
    description: "Fresh farm tomatoes",
    price: 30,
    category: "vegetables",
    stock: 80,
    image: "https://media.istockphoto.com/id/1095798054/photo/fresh-tomatoes-in-a-box.jpg?s=612x612&w=is&k=20&c=SHLm26qPa2WD1KJXujWHaBz51xNE6Ub9PL9oZVreUsM=",
    unit: "kg"
  },
  {
    name: "Potato",
    description: "High-quality potatoes for cooking",
    price: 25,
    category: "vegetables",
    stock: 120,
    image: "https://media.istockphoto.com/id/464381355/photo/raw-potato.jpg?s=612x612&w=is&k=20&c=ci_UNDSGKCA_kWW70sSyp931mNvXl6UunPVmqyRKVuw=",
    unit: "kg"
  },
  {
    name: "Milk",
    description: "Full cream cow milk",
    price: 60,
    category: "dairy",
    stock: 200,
    image: "https://media.istockphoto.com/id/1222018207/photo/pouring-milk-into-a-drinking-glass.jpg?s=612x612&w=is&k=20&c=F8mHn1W6qyLl9Mx-0mvfN6p4npTp209xLFz80dFpwlc=",
    unit: "liter"
  },
  {
    name: "Cheese",
    description: "Processed cheese slices",
    price: 150,
    category: "dairy",
    stock: 75,
    image: "https://media.istockphoto.com/id/120990404/photo/different-types-of-cheese-bread-and-tomatoes.jpg?s=612x612&w=0&k=20&c=LEuUPW45Zy9UyJ8oxhmD3vDShs0wUejBwQfSODVuRw8=",
    unit: "pack"
  },
  {
    name: "Chicken Breast",
    description: "Skinless chicken breast meat",
    price: 250,
    category: "meat",
    stock: 60,
    image: "https://media.istockphoto.com/id/93456470/photo/two-raw-chicken-breast-on-white-backdrop.jpg?s=612x612&w=is&k=20&c=BB-CIU8Ott7Klsc2VYez0HTXL4En4Gf0uYfMFB7VCDg=",
    unit: "kg"
  },
  {
    name: "Wheat Flour",
    description: "Stone-ground whole wheat flour",
    price: 45,
    category: "grains",
    stock: 150,
    image: "https://media.istockphoto.com/id/186831897/photo/flour-and-wheat-grains.jpg?s=612x612&w=is&k=20&c=HLmhELuzt9sb4bTjKPE2bIkXdBMuN8wGLXGVQVQAh24=",
    unit: "kg"
  },
  {
    name: "Rice",
    description: "Premium basmati rice",
    price: 90,
    category: "grains",
    stock: 200,
    image: "https://media.istockphoto.com/id/1126345377/photo/rice-in-a-wooden-bowl.jpg?s=612x612&w=is&k=20&c=I7ixSpOjsDn65Gnbh25VBVPze0GA1iUhJqu7K-fEK-I=",
    unit: "kg"
  },
  {
    name: "Coca-Cola",
    description: "Chilled soft drink bottle",
    price: 40,
    category: "beverages",
    stock: 300,
    image: "https://media.istockphoto.com/id/487787108/photo/can-of-coca-cola-on-ice.jpg?s=612x612&w=0&k=20&c=xDSO_nl0qeDMBZJBJk09jj5_UeQkyQ70QdXuDMByCaY=",
    unit: "liter"
  },
  {
    name: "Potato Chips",
    description: "Crispy salted potato chips",
    price: 20,
    category: "snacks",
    stock: 500,
    image: "https://media.istockphoto.com/id/891663430/photo/hands-giving-bowl-of-potato-chips-on-brown-background.jpg?s=612x612&w=is&k=20&c=7nU0CFJrxa9S__A3aMYjLfkOTjwSlccgX-Ec-x9nbdc=",
    unit: "pack"
  },
  {
    name: "Orange Juice",
    description: "Fresh orange juice without preservatives",
    price: 120,
    category: "beverages",
    stock: 90,
    image: "https://media.istockphoto.com/id/915657126/photo/orange-juice-glass-jar-shot-on-rustic-wooden-table.jpg?s=612x612&w=is&k=20&c=H-tAq0NaDg5t0f5I37F60v0O7fDwk1CZK-gcJiWRz8c=",
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
