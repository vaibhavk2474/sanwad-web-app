import { Router } from "express";
import { loginUser, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const route = Router();

route.route("/register").post(upload.none(), registerUser);
route.route("/login").post(upload.none(), loginUser);

export default route;
