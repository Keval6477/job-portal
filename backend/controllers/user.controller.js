import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { fullname, email, password, role, phoneNumber } = req.body;
    if (!fullname || !email || !password || !role || !phoneNumber) {
      return res.status(400).json({
        message: "something is missing",
        success: false,
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User already registered",
        success: false,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      fullname,
      email,
      password: hashedPassword,
      phoneNumber,
      role,
    });

    return res.status(201).json({
      message: "User created successfully.",
      success: true,
    });
  } catch (error) {
    console.log("Error in creating user=>>", error);
    return res.status(500).json({
      message: "something went wrong",
      success: false,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
        success: false,
      });
    }
    const matchedPassword = await bcrypt.compare(password, user.password);
    if (!matchedPassword) {
      return res.status(400).json({
        message: "Invalid email or password",
        success: false,
      });
    }
    if (role !== user.role) {
      return res.status(400).json({
        message: "Role does not match",
        success: false,
      });
    }

    const tokenData = {
      userId: user._id,
    };

    const token = await jwt.sign(tokenData, "1234567", {
      expiresIn: "1d",
    });

    user = {
      _id: user._id,
      fullname: user.fullname,
      role: user.role,
      email: user.email,
      phoneNumber: user.phoneNumber,
      profile: user.profile,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Login successful=> ${user.fullname}`,
        success: true,
        user,
      });
  } catch (error) {
    console.log("Error in Login user==>", error);
    return res.status(500).json({
      message: "something went wrong",
      success: false,
    });
  }
};

export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "User logout successfully.",
      success: true,
    });
  } catch (error) {
    console.log("Error in Logout user==>", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    const file = req.file;
    // if (!fullname || !email || !phoneNumber || !bio || !skills) {
    //   return res.status(400).json({
    //     message: "something is missing",
    //     success: false,
    //   });
    // }

    //claudinary code will come here;

    const userId = req.id;
    let user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        message: "user not found.",
        success: false,
      });
    }
    if (fullname) {
      user.fullname = fullname;
    }
    if (email) {
      user.email = email;
    }
    if (phoneNumber) {
      user.phoneNumber = phoneNumber;
    }
    if (skills) {
      const skillsArray = skills.split(",");
      user.profile.skills = skillsArray;
    }
    if (bio) {
      user.profile.bio = bio;
    }

    //resume and other thing come here..

    await user.save();

    user = {
      _id: user._id,
      fullname: user.fullname,
      role: user.role,
      email: user.email,
      phoneNumber: user.phoneNumber,
      profile: user.profile,
    };

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.log("Error in UpdateProfile user==>", error);
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }
};
