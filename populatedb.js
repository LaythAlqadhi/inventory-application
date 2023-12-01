#! /usr/bin/env node

console.log(
  'This script populates some test items, categories to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Category = require("./models/category");
const Item = require("./models/item");

const categories = [];
const items = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createCategories();
  await createItems();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function categoryCreate(index, name, description) {
  const categorydetail = { name: name, description: description };
  
  const category = new Category(categorydetail);

  await category.save();
  categories[index] = category;
  console.log(`Added category: ${name}`);
}

async function itemCreate(index, category, name, description, price, number_in_stock) {
  const itemdetail = {
    name: name,
    description: description,
    category: category,
    price: price,
    number_in_stock: number_in_stock,
  };

  const item = new Item(itemdetail);
  await item.save();
  items[index] = item;
  console.log(`Added item: ${name}`);
}

async function createCategories() {
  console.log("Adding categories");
  await Promise.all([
    categoryCreate(0, "Fresh Produce", "The Fresh Produce category offers a variety of naturally grown fruits and vegetables, providing you with quality options for a healthy and balanced diet."),
    categoryCreate(1, "Dairy and Eggs", "Dairy and Eggs bring you essential items like milk, cheese, and eggs, ensuring your kitchen is stocked with wholesome ingredients for your everyday meals."),
    categoryCreate(2, "Bakery", "The Bakery category brings you freshly baked goods, from bread to pastries, ensuring simple and delicious choices for your daily meals."),
    categoryCreate(3, "Meat and Seafood", "The Meat and Seafood category delivers a selection of high-quality meats and fresh seafood, ensuring you have wholesome options to create delicious and hearty meals."),
    categoryCreate(4, "Pantry Staples", "Pantry Staples is your go-to section for essential kitchen basics. From rice and pasta to canned goods, find everything you need to keep your pantry stocked and ready for everyday cooking."),
  ]);
}

async function createItems() {
  console.log("Adding items");
  await Promise.all([
    itemCreate(0, categories[0], "Apples", "Crisp and refreshing, our apples are a classic snack or versatile ingredient for your culinary creations. Enjoy the natural sweetness and crunch of these quality fruits.", 1.5, 100),
    itemCreate(0, categories[0], "Bananas", "Naturally sweet and packed with potassium, our bananas are a perfect on-the-go snack or a tasty addition to your morning routine.", 1.2, 80),
    itemCreate(0, categories[0], "Spinach", "Nutrient-rich and versatile, our fresh spinach is a great addition to salads, smoothies, or cooked dishes. Elevate your meals with this healthy green.", 2.0, 150),
    itemCreate(0, categories[0], "Tomatoes", "Juicy and flavorful, our tomatoes are a kitchen essential. Whether for salads, sauces, or sandwiches, enjoy the vibrant taste of these quality tomatoes.", 1.8, 120),
    itemCreate(0, categories[0], "Carrots", "Crunchy and vibrant, our carrots are a delicious snack or a colorful addition to your recipes. Packed with nutrients, they're a healthy choice for any meal.", 1.4, 100),
    itemCreate(1, categories[1], "Milk", "Creamy and fresh, our milk is a staple for your daily needs. From cereal to coffee, enjoy the rich taste and nutritional benefits of our quality dairy.", 2.5, 64),
    itemCreate(1, categories[1], "Cheese", "Indulge in the rich flavors of our premium cheese selection. Perfect for snacking, cooking, or charcuterie boards, elevate your culinary experience with our quality cheeses.", 3.0, 200),
    itemCreate(1, categories[1], "Eggs", "Farm-fresh and versatile, our eggs are a must-have in your kitchen. Whether scrambled, fried, or used in baking, enjoy the high-quality taste and nutrition of our eggs.", 2.2, 18),
    itemCreate(1, categories[1], "Yogurt", "Creamy and delicious, our yogurt is a wholesome choice for breakfast or a satisfying snack. Packed with probiotics, it's a tasty way to support your digestive health.", 1.8, 150),
    itemCreate(1, categories[1], "Butter", "Enhance the flavor of your dishes with our premium butter. Whether for baking or cooking, our quality butter adds a rich and savory touch to your culinary creations.", 2.0, 32),
    itemCreate(2, categories[2], "Bread", "Freshly baked and irresistibly good, our bread is the foundation of a great meal. From sandwiches to toast, savor the delicious taste and texture of our quality bread.", 2.2, 20),
    itemCreate(2, categories[2], "Bagels", "Enjoy the chewy goodness of our authentic bagels. Perfect for breakfast or as a satisfying snack, our bagels are a delightful treat you won't want to miss.", 2.5, 16),
    itemCreate(2, categories[2], "Croissants", "Indulge in the buttery layers of our flaky croissants. Whether paired with coffee or enjoyed on its own, our croissants are a decadent delight for any occasion.", 3.5, 12),
    itemCreate(2, categories[2], "Muffins", "Moist and flavorful, our muffins are a delightful treat for breakfast or anytime you crave something sweet. Explore a variety of flavors and enjoy the goodness in every bite.", 2.8, 24),
    itemCreate(2, categories[2], "Cookies", "Satisfy your sweet tooth with our scrumptious cookies. Baked to perfection, our cookies are a tasty indulgence that brings joy to every bite. Treat yourself today!", 2.0, 36),
    itemCreate(3, categories[3], "Chicken Breast", "Lean and protein-packed, our chicken breasts are a versatile choice for healthy and delicious meals. Grill, bake, or sauté – the possibilities are endless with our quality chicken.", 4.0, 10),
    itemCreate(3, categories[3], "Ground Beef", "Premium quality ground beef for your favorite recipes. From burgers to bolognese, our ground beef adds savory flavor and a satisfying texture to your culinary creations.", 3.5, 15),
    itemCreate(3, categories[3], "Salmon Fillets", "Savor the rich, flaky goodness of our salmon fillets. Whether grilled, baked, or pan-seared, our quality salmon is a healthy and delicious choice for seafood lovers.", 5.0, 8),
    itemCreate(3, categories[3], "Shrimp", "Enjoy the succulence of our tender shrimp. Perfect for stir-fries, pasta, or grilled dishes, our shrimp adds a touch of elegance to your meals. Dive into the exquisite taste today.", 4.2, 20),
    itemCreate(3, categories[3], "Pork Chops", "Juicy and flavorful, our pork chops are a classic choice for hearty meals. Whether roasted or grilled, our quality pork chops bring a delicious taste to your dinner table.", 3.8, 12),
    itemCreate(4, categories[4], "Rice", "A pantry essential, our rice is the foundation of many delicious dishes. From stir-fries to risottos, our quality rice adds a satisfying texture and taste to your favorite recipes.", 2.0, 40),
    itemCreate(4, categories[4], "Pasta", "Discover the perfect pasta for your favorite Italian recipes. From spaghetti to penne, our high-quality pasta brings the authentic taste and texture to your culinary creations.", 2.5, 30),
    itemCreate(4, categories[4], "Canned Tomatoes", "Enhance your sauces, stews, and soups with the rich flavor of our canned tomatoes. Packed at peak ripeness, our tomatoes bring a burst of freshness to your kitchen.", 1.8, 24),
    itemCreate(4, categories[4], "Flour", "Bake with confidence using our premium quality flour. Whether for bread, cakes, or cookies, our flour ensures consistent results and a delightful texture in your baked goods.", 2.2, 16),
    itemCreate(4, categories[4], "Olive Oil", "Elevate your cooking with the rich aroma and flavor of our extra virgin olive oil. Perfect for sautéing, dressing, or dipping, our olive oil is a kitchen essential for culinary enthusiasts.", 3.0, 25)
  ]);
}