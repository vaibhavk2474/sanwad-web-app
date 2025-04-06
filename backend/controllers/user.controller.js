import { User } from "../models/user.model.js";
import { validatePassword } from "../utils/validatePassword.js";

const registerUser = async (req, res) => {
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
};
const loginUser = async (req, res) => {
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
};
export { registerUser, loginUser };
