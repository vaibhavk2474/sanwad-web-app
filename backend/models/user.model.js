import mongoose from "mongoose";

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
		},
		phoneNumber: {
			type: String,
			required: true,
		},
		// avatar: {
		// 	type: String,
		// 	required: true,
		// },
		// coverImage: {
		// 	type: String,
		// 	required: true,
		// },
	},
	{ timestamps: true }
);

export const User = mongoose.model("User", userSchema);
