const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

const Category = require('../models/category');
const Item = require('../models/item');

exports.index = asyncHandler(async (req, res, next) => {
  const [numCategories, numItems] = await Promise.all([
    Category.countDocuments({}).exec(),
    Item.countDocuments({}).exec()
  ]);

  res.render('index', {
    title: 'Grocery Inventory',
    category_count: numCategories,
    item_count: numItems
  });
});

exports.category_list = asyncHandler(async (req, res, next) => {
  const categories = await Category.find().sort({ name: 1 }).exec();

  res.render('category_list', {
    title: 'Categories',
    categories: categories
  });
});

exports.category_detail = asyncHandler(async (req, res, next) => {
  const [category, items] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }).sort({ name: 1 }).exec()
  ]);

  if (category === null) {
    const err = new Error('Category Not Found');
    err.status = 404;
    return next(err);
  };
  
  res.render('category_detail', {
    title: category.name,
    category: category,
    items: items
  });
});

exports.category_create_get = asyncHandler(async (req, res, next) => {
  res.render('category_form', {
    title: 'Create Category'
  });
});

exports.category_create_post = [
  body('name', 'Name must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('description', 'Description must not be empty.').trim().isLength({ min: 1 }).escape(),

  asyncHandler(async (req, res, next) => {
    const results = validationResult(req);

    const category = new Category({
      name: req.body.name,
      description: req.body.description
    });

    if (!results.isEmpty()) {
      res.render('category_form', {
        title: 'Create Category',
        errors: results.array()
      });
      
      return;
    } else {
      await category.save();
      res.redirect(category.url);
    };
  })
];

exports.category_delete_get = asyncHandler(async (req, res, next) => {
  const [category, items] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }).sort({ name: 1 }).exec()
  ]);
  
  res.render('category_delete', {
    title: 'Delete Category',
    category: category,
    items: items
  });
});

exports.category_delete_post = asyncHandler(async (req, res, next) => {
  const [category, items] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }).sort({ name: 1 }).exec()
  ]);

  if (items.length > 0) {
    res.render('category_delete', {
      title: 'Delete Category',
      category: category,
      items: items
    });

    return;
  } else {
    await Category.findByIdAndDelete(req.body.categoryid);
    res.redirect('/catalog/categories');
  };
});

exports.category_update_get = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id).exec();

  if (category === null) {
    const err = new Error('Category Not Found');
    err.status = 404;
    return next(err);
  };

  res.render('category_form', {
    title: 'Update Category',
    category: category
  });
});

exports.category_update_post = [
  body('name', 'Name must not be empty').trim().isLength({ min: 1 }).escape(),
  body('description', 'Description must not be empty').trim().isLength({ min: 1 }).escape(),

  asyncHandler(async (req, res, next) => {
    const results = validationResult(req);

    const category = new Category({
      name: req.body.name,
      description: req.body.description,
      _id: req.params.id
    });

    if (!results.isEmpty()) {
      const category = await Category.findById(req.params.id).exec();
      
      res.render('category_form', {
        title: 'Update Category',
        category: category,
        errors: results.array()
      });
      
      return;
    } else {
      const updatedCategory = await Category.findByIdAndUpdate(req.params.id, category, {});
      res.redirect(updatedCategory.url);
    };
  })
];