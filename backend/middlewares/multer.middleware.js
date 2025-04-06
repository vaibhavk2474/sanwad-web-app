// multer is used for getting files and store in disk or memory.

import multer from "multer";

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./public/uploads");
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	},
});

export const upload = multer({
	storage,
});
