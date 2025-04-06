import dotenv from "dotenv";
dotenv.config({
	path: "./.env",
});
import connectDB from "./DB/index.js";
import app from "./app.js";

const port = process.env.port;

connectDB()
	.then(() => {
		app.listen(port, () => {
			console.log(`Example app listening on port ${port}`);
		});
	})
	.catch((error) => {
		console.log("MONGODB connection FAILED", error);
	});
