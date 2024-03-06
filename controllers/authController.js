const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const usermodel = require("../models/userModel");
const hashpassword = require("../helpers/authHelper");

// for register user
const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // validation
    if (!name) {
      return res.status(400).json({ mesage: "Name is required" });
    }
    if (!email) {
      return res.status(400).json({ mesage: "error: Email is required" });
    }
    if (!password) {
      return res.status(400).json({ mesage: "error: Password is required" });
    }

    // user checking
    const existingUser = await usermodel.findOne({ email });

    // existing user checking
    if (existingUser) {
      return res.status(200).json({
        success: false,
        message: "Already registered, please login",
      });
    }

    // register user
    const hashedPassword = await hashpassword(password);

    // save
    const user = new usermodel({ name, email, password: hashedPassword });
    await user.save();

    return res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    // return console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error in registration",
      error: error.message,
    });
  }
};

// for login user
// const loginController = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     //validation
//     if (!email || !password) {
//       return res.status(404).json({
//         success: false,
//         message: "invalid email or password",
//       });
//     }
//     //to find email
//     const user = await usermodel.findOne({ email });
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "email is not registerd",
//       });
//     }
//     //to check password
//     const match = await bcrypt.compare(password, user.password);
//     if (!match) {
//       return res.status(200).json({
//         success: false,
//         message: "invalid password",
//       });
//     }
//     //token
//     const token = await jwt.sign(
//       { _id: user._id },
//       process.env.JWT_SECRET_REFRESH_TOKEN,
//       { expiresIn: "7d" }
//     );
//     res.status(200).json({
//       success: true,
//       message: "login successfully",
//       user,
//       token,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "Error in login",
//       error: error.message,
//     });
//   }
// };

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Find email
    const user = await usermodel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email is not registered",
      });
    }

    // Check password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    // Generate token
    const token = await jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET_REFRESH_TOKEN,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successfully",
      user,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error in login",
      error: error.message,
    });
  }
};

const registerEmployerController = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // const result = await authSchema.validateAsync(req.body);
    // console.log(result);

    // Check if an admin with the same username or email already exists
    const existingAdmin = await usermodel.findOne({ email });

    // existing user checking
    if (existingAdmin) {
      return res.status(200).json({
        success: false,
        message: "Already registered, please login",
      });
    }
    const hashedPassword = await hashpassword(password);

    const adminUser = new usermodel({
      name,
      email,
      password: hashedPassword,
      role: 1,
    });

    await adminUser.save();

    // const accessToken = await signAccessToken(adminUser.id);
    // const refreshToken = await signRefreshToken(adminUser.id);

    return res.status(201).json({
      message: "Admin registration successful",
      adminUser,
      // refreshToken,
    });
  } catch (error) {
    if (error) {
      // Validation error occurred
      return res.status(400).json({ message: error.message });
    } else {
      console.error("Error registering Admin:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }
};

module.exports = {
  registerController,
  loginController,
  registerEmployerController,
};
