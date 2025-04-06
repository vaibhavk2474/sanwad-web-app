import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { PASSWORD_REGEX } from "../constants/index.js";

const strongPasswordRegex = PASSWORD_REGEX;
const userSchema = new mongoose.Schema(
	{
		fullName: {
			type: String,
			required: true,
		},
		userName: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
			validate: {
				validator: function (value) {
					return strongPasswordRegex.test(value);
				},
				message:
					"Password must be at least 8 characters and include uppercase, lowercase, number, and special character.",
			},
		},
		phoneNumber: {
			type: String,
			required: true,
		},
		avatar: {
			type: String,
			required: true,
		},
		coverImage: {
			type: String,
		},
	},
	{ timestamps: true }
);

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next(); // only hash if changed
	this.password = await bcrypt.hash(this.password, 10);
	next();
});

export const User = mongoose.model("User", userSchema);
