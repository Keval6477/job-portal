import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated.",
      });
    }
    const decode = await jwt.decode(token, "1234567");
    if (!decode) {
      return res.status(401).json({
        success: false,
        message: "Invalid token.",
      });
    }
    req.id = decode.userId;
    next();
  } catch (error) {
    console.log("Auth Error=>", error);
  }
};

export default isAuthenticated;
