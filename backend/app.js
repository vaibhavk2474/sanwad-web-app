import express from "express";
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

import userRoute from "./routes/user.route.js";
app.use("/api/v1/user", userRoute);
app.get("/api/v1", (req, res) => {
	res.status(200).json({ message: "Api is working" });
});

export default app;
