export const validatePassword = (password = "") =>
	password.length < 8 || password.length > 32
		? "Password must be 8-32 characters."
		: !/[a-z]/.test(password)
		? "Password must contain a lowercase letter."
		: !/[A-Z]/.test(password)
		? "Password must contain an uppercase letter."
		: !/[0-9]/.test(password)
		? "Password must contain a number."
		: !/[!@#$%^&*(),.?\":{}|<>]/.test(password)
		? "Password must contain a special character."
		: null;
