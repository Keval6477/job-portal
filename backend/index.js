import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDb from "./utils/db.js";
dotenv.config({});
const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());

//db connection
connectDb();

const crosOptions = {
  origin: "http://localhost:5173",
  Credentials: true,
};
app.use(cors(crosOptions));

app.get("/testing", (req, res) => {
  return res.status(200).json({
    success: true,
    messagee: "hi",
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`server is listening on port =>${PORT}`);
});
