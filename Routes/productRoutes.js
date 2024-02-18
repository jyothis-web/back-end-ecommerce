const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const productController = require("../controllers/productController");

const {
  requireSignin,
  loginAdmin,
} = require("../middlewares/authMiddleware");

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    let ext = path.extname(file.originalname)
    cb(null, Date.now() + ext);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Validate the file type if needed
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp|avif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Route for create product
router.post(
  '/create-product',
  // requireSignin,
  // loginAdmin,
  upload.single('file'),
  // upload.array('additionalImage', 1), 
  productController.createproductController
);

//route for update category
router.put(
  '/update-product/:id',
  // requireSignin,
  // loginAdmin,
  upload.single('file'),
  (req, res, next) => {
    if (req.fileValidationError) {
      return res.status(400).json({
        success: false,
        message: req.fileValidationError,
      });
    }
    next();
  },
  productController.updateproductController
);

//route for get all products
router.get(
  '/get-product',
  // requireSignin,
  // loginAdmin,
  productController.getproductController
);

//route for get sigle product by
router.get(
  '/get-singleproduct/:id',
  // requireSignin,
  // loginAdmin,
  productController.singleproductController
);
//route for get single product by slug
router.get(
  '/get-singleproduct/:slug',
  // requireSignin,
  // loginAdmin,
  productController.singleproductController
);

//get products based on category
router.get(
  '/get-products-by-category/:categoryId',
  // requireSignin,
  // loginAdmin,
  productController.getProductsByCategoryController
);

// Route for delete product
router.delete(
  '/delete-product/:id',
  // requireSignin,
  // loginAdmin,
  productController.deleteproductController
);
// Route for delete product
router.get(
  '/image-product/:id',
  // requireSignin,
  // loginAdmin,
  productController.imageproductController
);
// Route for filter product
router.post(
  '/filter-product',
  // requireSignin,
  // loginAdmin,
  productController.filterproductController
);

//search product
router.get(
  '/search/:keyword',
  // requireSignin,
  // loginAdmin,
  productController.searchproductController
);


module.exports = router;







// const express = require("express");
// const router = express.Router();
//  const productController = require("../controllers/productController");


// const {
//   requireSignin,
//   loginAdmin,
// } = require("../middlewares/authMiddleware");



// //route for create product
// router.post(
//     '/create-product',
//     // requireSignin,
//     // loginAdmin,
//     productController.upload.single('image'),
//     productController.createproductController
//   );



// module.exports = router;
