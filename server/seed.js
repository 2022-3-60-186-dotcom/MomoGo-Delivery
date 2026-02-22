import dotenv from "dotenv";
import dns from "dns";
import connectDb from "./db.js";
import MenuItem from "./models/MenuItem.js";

// Force Node.js to use Google DNS
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();

const menuItems = [
  {
    name: 'Chicken Momo',
    description: 'Juicy chicken filling wrapped in soft dough, steamed to perfection. Served with signature tomato chutney.',
    price: 150,
    image: '/src/assets/chicken-momo.jpg',
    category: 'steam',
    isPopular: true,
    isAvailable: true,
  },
  {
    name: 'Vegetable Momo',
    description: 'Fresh seasonal vegetables with aromatic spices. A delightful vegetarian option.',
    price: 120,
    image: '/src/assets/veg-momo.jpg',
    category: 'steam',
    isAvailable: true,
  },
  {
    name: 'Buff Momo',
    description: 'Traditional buffalo meat filling with authentic Nepali spices. Rich and flavorful.',
    price: 160,
    image: '/src/assets/buff-momo.jpg',
    category: 'steam',
    isSpicy: true,
    isAvailable: true,
  },
  {
    name: 'Fried Chicken Momo',
    description: 'Crispy golden fried momos with chicken filling. Perfect crunchy texture.',
    price: 180,
    image: '/src/assets/fried-momo.jpg',
    category: 'fried',
    isPopular: true,
    isAvailable: true,
  },
  {
    name: 'Fried Vegetable Momo',
    description: 'Crispy fried vegetable momos with a golden crust. Served with spicy sauce.',
    price: 150,
    image: '/src/assets/fried-momo.jpg',
    category: 'fried',
    isAvailable: true,
  },
  {
    name: 'Fried Buff Momo',
    description: 'Crispy fried buffalo momos with authentic spices. Extra crunchy goodness.',
    price: 190,
    image: '/src/assets/fried-momo.jpg',
    category: 'fried',
    isSpicy: true,
    isAvailable: true,
  },
  {
    name: 'Jhol Momo',
    description: 'Steamed momos dipped in spicy sesame-tomato soup. Our signature specialty!',
    price: 180,
    image: '/src/assets/buff-momo.jpg',
    category: 'special',
    isPopular: true,
    isSpicy: true,
    isAvailable: true,
  },
  {
    name: 'Chilli Momo',
    description: 'Fried momos tossed in spicy chilli sauce with bell peppers and onions.',
    price: 200,
    image: '/src/assets/fried-momo.jpg',
    category: 'special',
    isSpicy: true,
    isAvailable: true,
  },
];

async function seedDatabase() {
  try {
    await connectDb();
    console.log('Connected to MongoDB');

    // Clear existing menu items
    await MenuItem.deleteMany({});
    console.log('Cleared existing menu items');

    // Insert new menu items
    const result = await MenuItem.insertMany(menuItems);
    console.log(`Successfully seeded ${result.length} menu items`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
