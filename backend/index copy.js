// const bodyParser = require("body-parser");
import dotenv from "dotenv";
dotenv.config({
	path: "./.env",
});
import express from "express";
import multer from "multer";
import { validatePassword } from "./utils/validatePassword.js";
import connectDB from "./DB/index.js";
import { User } from "./models/user.model.js";
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const upload = multer();

const DB = [];

connectDB();

app.post("/signup", upload.none(), async (req, res) => {
	try {
		const {
			fullName,
			userName,
			email,
			password,
			phoneNumber,
			avatar,
			coverImage,
		} = req.body;

		// get user details
		// validate all details
		// update this new user in database
		// send response with message

		const newUser = {
			fullName,
			userName,
			email,
			password,
			phoneNumber,
			// avatar,
			// coverImage,
		};

		// check validations error
		const validationErrors = Object.keys(newUser).reduce(
			(prevState, currentField) => {
				if (currentField === "password") {
					if (!newUser[currentField]) {
						return {
							...prevState,
							[currentField]: `${currentField} is required.`,
						};
					}

					const passwordError = validatePassword(
						newUser[currentField]
					);
					console.log(passwordError);

					if (passwordError) {
						return {
							...prevState,
							[currentField]: `${passwordError}`,
						};
					} else {
						return prevState;
					}
				} else if (!newUser[currentField]) {
					return {
						...prevState,
						[currentField]: `${currentField} is required.`,
					};
				} else {
					return prevState;
				}
			},
			{}
		);

		if (Object.keys(validationErrors).length !== 0) {
			return res.status(400).send({
				message: "Validation errors",
				error: validationErrors,
			});
		}

		const isUserAlreadyExist = await User.findOne({ email });

		if (isUserAlreadyExist) {
			return res.status(400).json({
				mesaage: "User already exist.",
			});
		}

		const newUserOnDB = await User.create({
			...newUser,
		});

		const userObj = newUserOnDB.toJSON();

		delete userObj["password"];

		res.status(200).json({
			mesaage: "Signup successfully done",
			user: userObj,
		});
	} catch (error) {
		return res.status(500).send({
			message: error?.message || "Signup error occurs",
			error: error,
		});
	}
});

app.post("/login", upload.none(), async (req, res) => {
	// get login details - email and password
	// validate credentials -
	// email is present or not, if not then send error
	// if email presents then check password is correct or not
	// if password is correct then send proper response
	// is not then send error

	const { email, password } = req.body;

	if (!email) {
		return res.status(400).json({
			mesaage: "Email is required.",
		});
	}
	if (!password) {
		return res.status(400).json({
			mesaage: "Password is required.",
		});
	}

	const user = await User.findOne({ email });

	if (!user) {
		return res.status(404).json({
			mesaage: "User not found.",
		});
	}

	console.log("user...", user);

	if (user.password !== password) {
		return res.status(400).json({
			mesaage: "Password did not match.",
		});
	}

	const userObj = user.toJSON();
	delete userObj["password"];

	return res.status(200).json({
		mesaage: "User found successfully.",
		user: userObj,
	});
});

app.get("/api/jokes", (req, res) => {
	res.status(200).json({
		data: [
			{
				id: "1",
				joke: "A Joke",
			},
			{
				id: "2",
				joke: "Another Joke",
			},
		],
	});
});

app.get("/", (req, res) => {
	res.send("<h1>You are on home page.</h1>");
});

app.get("/all-users", (req, res) => {
	res.status(200).json({ users: DB });
});

app.get("/user/:id", (req, res) => {
	console.log(DB);

	const id = req.params.id;

	if (id) {
		const data = DB.find((cItem) => cItem.id == id);

		res.status(200).json({ users: data });

		return;
	}
	res.status(404).json({ users: "User Not found." });
});

app.post("/create-user", (req, res) => {
	const { name, email } = req.body;

	const newUser = {
		id: Math.random(),
		name,
		email,
	};

	DB.push(newUser);

	res.status(200).json({ message: "New User Added Successfully." });
});

app.put("/update-user/:id", (req, res) => {
	const { name, email } = req.body;

	const id = req.params.id;

	if (!id) {
		res.status(500).json({ message: "Give proper id." });
	}

	const index = DB.findIndex((cItem) => cItem.id == id);

	if (index === -1) {
		res.status(404).json({ message: "User not found." });
	}

	const newData = DB.map((cItem) => {
		if (cItem.id == id) {
			return {
				...cItem,
				name,
				email,
			};
		}
		return cItem;
	});

	DB.length = 0;

	DB.push(...newData);

	res.status(200).json({ message: "User is updated" });
});

app.delete("/delete-user/:id", (req, res) => {
	const id = req.params.id;

	console.log(id, 1);

	if (!id) {
		res.status(500).json({ message: "Id is not correct." });
		return;
	}

	const index = DB.findIndex((c) => c.id == id);

	if (index === -1) {
		res.status(404).json({ message: "User not found." });
		return;
	}

	const newData = DB.filter((c) => c.id != id);

	DB.length = 0;

	DB.push(...newData);

	res.status(200).json({ message: "User deleted" });
});

// form
app.get("/protected-route/form", (req, res) => {
	console.log(req.query);

	const email = req.query.email;
	const password = req.query.password;

	if (email == "super.admin@test.com" && password == "Soulab@123") {
		res.status(200).send(`
			<h1>You are logged in.</h1>
			<p>Email: ${email} </p>
			<p>Email :${password} </p>
			`);

		return;
	}
	res.status(200).send(`
		<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Form</title>
    <style>
		* {
			margin: 0;
			padding: 0;
			box-sizing: border-box;
			font-family: Arial, sans-serif;
		}
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f4f4f4;
        }
        .form-container {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
			width:600px
        }
        input {
            display: block;
            width: 100%;
            margin: 10px 0;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
        }
        button {
            width: 100%;
            padding: 10px;
            background-color: #28a745;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        button:hover {
            background-color: #218838;
        }
    </style>
</head>
<body>
    <div class="form-container">
        <form 
		
		>
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>
            
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required>
            
            <button type="submit">Submit</button>
        </form>

		${email && password ? `<p style="color:red;">You are not loggen in.</p>` : ""}

		
    </div>
</body>
</html>`);
});

app.post("/protected-route", (req, res) => {
	const id = req.query.id;

	console.log(req.params, req.query);

	if (id) {
		res.status(200).send("<h1>You are logged in.</h1>");
	} else {
		res.status(404).send("<h1>You are not logged in.</h1>");
	}
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
