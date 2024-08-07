const { z } = require("zod");
const Category = require('../models/category');
const Item = require("../models/item");


const GetAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate("items").sort({ __created: -1 });
    return res.json(categories);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const GetCategory = async (req, res) => {
    try {
      const category = await Category.findById(req.params.id).populate("items").sort({ __created: -1 });
      if (!category) {
        return res.status(404).json({ message: 'Category not found!' });
      }
      res.json(category);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

const AddCategory = async (req, res) => {
  try {
    const { name, description, icon } = req.body;
    
    const category = new Category({ name, description, icon: icon || "" });
    await category.save();
    return res.status(201).json(category);
  } catch (err) {
    if (err instanceof z.ZodError) {
      const errorMessages = err.errors.map(e => e.message);
      return res.status(400).json({ message: errorMessages });
    }
    return res.status(500).json({ message: err.message });
  }
};

const UpdateCategory = async (req, res) => {
  try {
   
    const { name, description, icon } = req.body;
    console.log(req.body);
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found!' });
    }
    if (name) category.name = name;
    if (description) category.description = description;
    if(icon) category.icon = icon;
    await category.save();
    return res.json(category);
  } catch (err) {
    if (err instanceof z.ZodError) {
      const errorMessages = err.errors.map(e => e.message);
      return res.status(400).json({ message: errorMessages });
    }
    return res.status(500).json({ message: err.message });
  }
};

const DeleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found!' });
    }

    await Item.updateMany({ category: req.params.id }, { category: null });
    res.status(201).json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
    AddCategory,
    GetAllCategories,
    GetCategory,
    UpdateCategory,
    DeleteCategory,
}
