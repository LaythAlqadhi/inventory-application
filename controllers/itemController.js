const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

const Category = require('../models/category');
const Item = require('../models/item');

exports.item_list = asyncHandler(async (req, res, next) => {
  const items = await Item.find().populate('category').sort({ name: 1 }).exec();

  res.render('item_list', {
    title: 'Item List',
    items: items
  });
});

exports.item_detail = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).populate('category').exec();

  res.render('item_detail', {
    title: item.name,
    item: item
  });
});

exports.item_create_get = asyncHandler(async (req, res, next) => {
  const categories = await Category.find({}, 'name').sort({ name: 1 }).exec();

  res.render('item_form', {
    title: 'Create Item',
    categories: categories
  });
});

exports.item_create_post = [
  body('name', 'Name must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('description', 'Description must not be empty')
  .trim()
  .isLength({ min: 1 })
  .escape(),
  body('category', 'Category must not be specified')
  .escape(),
  body('price', 'Price must not be empty')
  .trim()
  .isLength({ min: 1 })
  .escape(),
  body('number_in_stock', 'Number In Stock must not be empty')
  .trim()
  .isLength({ min: 1 })
  .escape(),

  asyncHandler(async (req, res, next) => {
    const results = validationResult(req);

    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      number_in_stock: req.body.number_in_stock
    });

    if (!results.isEmpty()) {
      const categories = await Category.find({}, 'name').sort({ name: 1 }).exec();

      res.render('item_form', {
        title: 'Create Item',
        categories: categories,
        errors: results.array()
      });

      return;
    } else {
      await item.save();
      res.redirect('/catalog/items');
    };
  })
];

exports.item_delete_get = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).exec();

  res.render('item_delete', {
    title: 'Delete Item',
    item: item
  });
});

exports.item_delete_post = asyncHandler(async (req, res, next) => {
  await Item.findByIdAndDelete(req.body.itemid);
  res.redirect('/catalog/items');
});

exports.item_update_get = asyncHandler(async (req, res, next) => {
  const [item, categories] = await Promise.all([
    Item.findById(req.params.id).populate('category').exec(),
    Category.find({}, 'name').sort({ name: 1 }).exec()
  ]);

  res.render('item_form', {
    title: 'Update Item',
    item: item,
    categories: categories
  });
});

exports.item_update_post = [
  body('name', 'Name must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('description', 'Description must not be empty')
  .trim()
  .isLength({ min: 1 })
  .escape(),
  body('category', 'Category must not be specified')
  .escape(),
  body('price', 'Price must not be empty')
  .trim()
  .isLength({ min: 1 })
  .escape(),
  body('number_in_stock', 'Number In Stock must not be empty')
  .trim()
  .isLength({ min: 1 })
  .escape(),

  asyncHandler(async (req, res, next) => {
    const results = validationResult(req);

    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      number_in_stock: req.body.number_in_stock,
      _id: req.params.id
    });

    if (!results.isEmpty()) {
      const [item, categories] = await Promise.all([
        Item.findById(req.params.id).populate('category').exec(),
        Category.find({}, 'name').sort({ name: 1 }).exec()
      ]);

      res.render('item_form', {
        title: 'Update Item',
        item: item,
        categories: categories,
        errors: results.array()
      });

      return;
    } else {
      const updatedItem = await Item.findByIdAndUpdate(req.body.itemid);
      res.redirect(updatedItem.url);
    };
  })
];