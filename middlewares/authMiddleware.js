// const jwt = require("jsonwebtoken");
// const userModel = require("../models/userModel");

// //protect route token base
// const requireSignin = async (req, res, next) => {
//     // const decode = jwt.verify(
//     //   req.headers.authorization,
//     //   process.env.JWT_SECRET_REFRESH_TOKEN
//     // );
//     // req.user = decode;

//   } catch (error) {
//     console.log(error);
//   }
// };
// //admin access
// const isadmin = async (req, res, next) => {
//   try {
//     const {email} = req.body;
//     const user = await userModel.findById(email);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     if (user.role !== 1) {
//       return res.status(403).json({ message: "Unauthorized access" });
//     } else {
//       next();
//     }
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// module.exports = {
//   requireSignin,
//   isadmin,
// };

const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

//protect route token base
const requireSignin = async (req, res, next) => {
  try {
    // if (req.user.role !== 1) {
    //   return res.status(403).json({ message: "Unauthorized access" });
    // } else {
    //   next();
    // }
    const decode = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET_REFRESH_TOKEN
    );
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "The token is missing" });

  }
};



const loginAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== 1) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    // User has the required role, proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


//admin access
const isadmin = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email }); // Use findOne with email

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== 1) {
      return res.status(403).json({ message: "Unauthorized access" });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  requireSignin,
  isadmin,
  loginAdmin,
};

