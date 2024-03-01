const slugify = require("slugify");
const productModel = require("../models/productModel");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

//for creating products
const createproductController = async (req, res) => {
  try {
    const { name, price, category, rating, newimg,description } = req.body;
    const file = req.file;
console.log(req.body);
    if (!file) {
      return res.status(400).json({ message: "Photo is required" });
    }
    if (!name || !price || !category) {
      return res
        .status(400)
        .json({ message: "name, price, category should be filled" });
    }

    const existingproduct = await productModel.findOne({ name });
    if (existingproduct) {
      return res
        .status(401)
        .json({ success: false, message: "Product already exists" });
    }

    const product = new productModel({
      name,
      slug: slugify(name),
      description,
      price,
      category,
      rating,
      newimg,
      image: {
        data: file.buffer, // Save the buffer directly
        contentType: file.mimetype,
        imagePath: `uploads/${file.filename}`,
      },
    });

    // Save the product to the database
    await product.save();

    return res.status(201).json({
      success: true,
      message: "New product created successfully",
      imageName: file.filename,
      product,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in creating product",
      error,
    });
  }
};

//for updating products
const updateproductController = async (req, res) => {
  // let newImage;
  try {
    const { name, price, category, rating, newimg,description  } = req.body;
    const { id } = req.params;
    const file = req.file;

    console.log("Payload:", req.body);
    console.log("Image File:", file);

    // Check if the ID is provided
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID not provided",
      });
    }

    // Find the product in the database
    const existingProduct = await productModel.findById(id);

    // Check if the product with the given ID exists
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let newImage; // Declare newImage outside the try block

    try {
      // Create a new object for the image field
      image = {
        data: file.buffer, // Use file.buffer directly
        contentType: file.mimetype,
        imagePath: `uploads/${file.filename}`,
      };
      // image: {
      //   data: file.buffer, // Save the buffer directly
      //   contentType: file.mimetype,
      //   imagePath: `uploads/${file.filename}`,
      // },

      // Set the new image object to existingProduct.image
      console.log("New image after update:", image);

      // Remove the temporary file      // fs.unlinkSync(file.path);
      // console.log("File path:", file.path);
      // console.log("Does file exist?", fs.existsSync(file.path));
    } catch (readError) {
      console.error("Error reading or saving new image:", readError.message);
      return res.status(500).json({
        success: false,
        message: "Error while updating product image",
        error: readError.message,
      });
    }

    // Update product fields
    existingProduct.name = name || existingProduct.name;
    existingProduct.description = description || existingProduct.description;
    existingProduct.slug = slugify(existingProduct.name);
    existingProduct.price = price || existingProduct.price;
    existingProduct.category = category || existingProduct.category;
    existingProduct.rating = rating || existingProduct.rating;
    existingProduct.newimg = newimg || existingProduct.newimg;
    existingProduct.image = image || existingProduct.image;

    // Save the updated product to the database
    await existingProduct.save();

    // Include the image information in the response
    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      existingProduct,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error while updating product",
      error,
    });
  }
};


//for get all products
const getproductController = async (req, res) => {
  try {
    const products = await productModel.find({}).populate("category");

    // Send JSON response with products
    return res.status(200).json({
      success: true,
      message: "product list fetched successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error while getting all products",
    });
  }
};

//for get single product
const singleproductController = async (req, res) => {
  try {
    const { id } = req.params;
    // Validate if the ID is provided
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "product ID not provided",
      });
    }
    // Fetch the single category from the database by ID
    const product = await productModel.findById(id).populate("category");
    return res.status(200).json({
      success: true,
      imageName: product.image,
      message: "Single product fetched successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error while getting all products",
    });
  }
};

//for geting products based on category
const getProductsByCategoryController = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Fetch products based on category ID
    const products = await productModel
      .find({ category: categoryId })

      .populate("category");

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully based on category",
      products,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error while getting products by category",
      error,
    });
  }
};

//for delete the products
const deleteproductController = async (req, res) => {
  try {
    const { id } = req.params;
    // Validate if the ID is provided
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID not provided",
      });
    }

    // Find and remove the product from the database
    const deletedProduct = await productModel.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      product: deletedProduct,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error while deleting product",
      error,
    });
  }
};
//image
const imageproductController = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate if the ID is provided
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID not provided",
      });
    }

    // Fetch the product from the database by ID
    const product = await productModel.findById(id).select("image");

    if (!product || !product.image) {
      return res.status(404).json({
        success: false,
        message: "Product not found or no image available",
      });
    }
    res.set("Content-Type", product.image.contentType);

    // Send the base64-encoded image data as the response body
    return res.status(200).send(base64Image);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error while fetching product image",
      error,
    });
  }
};
//for filter the product
const filterproductController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args={}
    if(checked.length > 0) args.category =checked
    if(radio.length)args.price = {$gte : radio[0],$lte:radio[1]}
    const products = await productModel.find(args)
    return res.status(200).json({
      success: true,
     products,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error while filtering products",
      error,
    });
  }
};

const searchproductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const result = await productModel.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } }
      ]
    });
    return res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Error while searching products:", error);

    return res.status(500).json({
      success: false,
      message: "Error while searching products",
      error: error.message,  // Log the error message
    });
  }
};

module.exports = {
  createproductController,
  updateproductController,
  singleproductController,
  getproductController,
  getProductsByCategoryController,
  deleteproductController,
  imageproductController,
  filterproductController,
  searchproductController,
};

// const slugify = require('slugify');
// const productModel = require('../models/productModel');
// const fs = require('fs');

// const createproductController = async (req, res) => {
//   try {
//     const { name, price, category } = req.body;
//     const mainfile = req.file;
//     const additionalImageFile = req.file.additionalImage; // Assuming the field name is 'additionalImage'

//     if (!mainImageFile) {
//       return res.status(400).json({ message: 'Main photo is required' });
//     }

//     // Read the main image file data
//     const mainImageBuffer = fs.readFileSync(mainImageFile.path);

//     // Create a product document for the main image
//     const productData = {
//       name,
//       slug: slugify(name),
//       price,
//       category,
//       image: {
//         data: mainImageBuffer,
//         contentType: mainImageFile.mimetype,
//       },
//     };

//     // Check and handle the additional image
//     if (additionalImageFile) {
//       const additionalImageBuffer = fs.readFileSync(additionalImageFile[0].path);
//       productData.additionalImage = {
//         data: additionalImageBuffer,
//         contentType: additionalImageFile[0].mimetype,
//       };
//     }

//     const product = new productModel(productData);

//     // Save the product to the database
//     await product.save();

//     // Remove the temporary files
//     fs.unlinkSync(mainImageFile.path);

//     if (additionalImageFile) {
//       fs.unlinkSync(additionalImageFile[0].path);
//     }

//     return res.status(201).json({
//       success: true,
//       message: 'New product created successfully',
//       product,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       success: false,
//       message: 'Error in creating product',
//       error,
//     });
//   }
// };

// module.exports = { createproductController };
