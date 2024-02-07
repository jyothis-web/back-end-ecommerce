const categoryModel = require("../models/categoryModel");
const slugify = require("slugify");

const createcategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res
        .status(401)
        .json({ success: false, message: "error in category" });
    }
    const existingCategory = await categoryModel.findOne({ name });
    if (existingCategory) {
      return res
        .status(401)
        .json({ success: true, message: "category already exists" });
    }
    const category = await new categoryModel({
      name,
      slug: slugify(name),
    }).save();
    return res
      .status(201)
      .json({ success: true, message: "new category created", category });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "error in category" });
  }
};

const updatecategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    // Check if a category with the same name already exists
    const existingCategoryByName = await categoryModel.findOne({ name });

    // If a category with the same name exists and it has a different ID than the one being updated, return an error response
    if (existingCategoryByName && existingCategoryByName._id.toString() !== id) {
      return res.status(400).json({
        success: false,
        message: "Category with the same name already exists",
      });
    }

    // Update the category
    const updatedCategory = await categoryModel.findByIdAndUpdate(
      id,
      {
        name,
        slug: slugify(name),
      },
      {
        new: true,
      }
    );

    return res.status(201).json({
      success: true,
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error while updating category",
    });
  }
};


// const getcategoryController = async (req, res) => {

//   try {
//     const category = await categoryModel.find({});
//     console.log('Category data:', category);
//     // return res.status(200).json({
//     //   success: true,
//     //   message: "Category list fetched successfully",
//     //   category,
//     // });
//   } catch (error) {
//     console.log(error);
//     // return res.status(500).json({
//     //   success: false,
//     //   message: "Error while getting all categories",
//     // });
//   }
// };

const getcategoryController = async (req, res) => {
  try {
    // Fetch categories from the database
    const categories = await categoryModel.find({}, "name slug");

    // Send JSON response with categories
    return res.status(200).json({
      success: true,
      message: "Category list fetched successfully",
      categories,
    });
  } catch (error) {
    console.error(error);

    // Send JSON response for the error
    return res.status(500).json({
      success: false,
      message: "Error while getting all categories",
    });
  }
};

const singlecategoryController = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate if the ID is provided
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Category ID not provided",
      });
    }
    // Fetch the single category from the database by ID
    const category = await categoryModel.findById(id);
    // Send JSON response with the single category
    return res.status(200).json({
      success: true,
      message: "Single category fetched successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error while getting single categories",
    });
  }
};

const deletecategoryController = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate if the ID is provided
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Category ID not provided",
      });
    }

    // Find and delete the category by ID
    const deletedCategory = await categoryModel.findByIdAndDelete(id);

    // if (!deletedCategory) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "Category not found",
    //   });
    // }
    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      deletedCategory,
    });
  } catch (error) {
    console.log(error);
    // return res.status(500).json({
    //   success: false,
    //   message: "Error while deleting the category",
    // });
  }
};

module.exports = {
  createcategoryController,
  updatecategoryController,
  getcategoryController,
  singlecategoryController,
  deletecategoryController,
};
