const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

const {
  requireSignin,
  loginAdmin,
} = require("../middlewares/authMiddleware");

//route for create category
router.post(
  "/create-category",
  // requireSignin,
  // loginAdmin,
  categoryController.createcategoryController
);

//route for update category
router.put(
    '/update-category/:id',
    // requireSignin,
    // loginAdmin,
    categoryController.updatecategoryController
  );

//route for get all category
router.get(
    '/get-category',
    // requireSignin,
    // loginAdmin,
    categoryController.getcategoryController
  );

  //route for get single category
router.get(
    '/single-category/:id',
    // requireSignin,
    // loginAdmin,
    categoryController.singlecategoryController
  );

  //route for delete single category
router.delete(
    '/delete-category/:id',
    // requireSignin,
    // loginAdmin,
    categoryController.deletecategoryController
  );

module.exports = router;
