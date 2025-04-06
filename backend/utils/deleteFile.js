import fs from "fs";

const deleteFile = (filePath) => {
	fs.unlink(filePath, (err) => {
		if (err) {
			console.error("Error deleting file:", err);
		} else {
			console.log("Deleted local file:", filePath);
		}
	});
};

export default deleteFile;
