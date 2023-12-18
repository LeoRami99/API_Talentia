import multer, { StorageEngine } from "multer";
import { Request, Response, NextFunction } from "express";
import { promisify } from "util";
import sizeOf from "image-size";
import fs from "fs";

interface RequestWithImage extends Request {
	fileName?: string;
	file?: Express.Multer.File;
}

const storage: StorageEngine = multer.diskStorage({
	destination: function (req, file, cb) {
		// cb(null, "src/uploads/images/photos");
		// prod path
		cb(null, "src/uploads/images/");
	},
	filename: function (req: RequestWithImage, file, cb) {
		const fileExt = file.mimetype.split("/")[1];
		const fileName = file.fieldname + "-" + Date.now() + "." + fileExt;
		req.fileName = fileName; // Guarda el nombre del archivo en el objeto de solicitud
		cb(null, fileName);
	},
});

const upload = multer({ storage: storage }).single("image");

export const uploadImageMiddleware = (req: RequestWithImage, res: Response, next: NextFunction) => {
	upload(req, res, function (err) {
		if (err) {
			console.log(err);
			return res.status(500).json({ message: "Error al subir la imagen." });
		}
		next();
	});
};

export const checkImageSizeMiddleware = async (req: RequestWithImage, res: Response, next: NextFunction) => {
	if (!req.file) {
		return res.status(400).json({ message: "No se ha subido ninguna imagen." });
	}

	const path = req.file.path;
	try {
		const dimensions: any = await promisify(sizeOf)(path);
		if (dimensions.width !== 430 || dimensions.height !== 168) {
			await deleteFile(path); // Elimina el archivo si no cumple con el tamaño
			return res.status(400).json({ message: "La imagen debe ser de 150x150px." });
		}
		next();
	} catch (err: any) {
		await deleteFile(path); // Intenta eliminar el archivo en caso de error
		return res.status(500).json({ message: "Error al verificar el tamaño de la imagen." });
	}
};

const deleteFile = (path: string) => {
	return promisify(fs.unlink)(path);
};

// middleware for update img
export const replaceImageMiddleware = async (req: RequestWithImage, res: Response, next: NextFunction) => {
	if (!req.file) {
		return res.status(400).json({ message: "No se ha subido ninguna imagen." });
	}

	const oldFileName = req.body.oldFileName; // Nombre del archivo antiguo obtenido de la solicitud
	// const oldPath = "src/uploads/images/photos/" + oldFileName;
	// producción path
	const oldPath = "src/uploads/images/" + oldFileName;

	const newFileExt = req.file.mimetype.split("/")[1];
	const newFileName = req.file.fieldname + "-" + Date.now() + "." + newFileExt;
	// const newPath = "src/uploads/images/photos/" + newFileName;
	// producción path
	const newPath = "src/uploads/images/" + newFileName;

	try {
		if (fs.existsSync(oldPath)) {
			await promisify(fs.unlink)(oldPath); // Elimina el archivo antiguo
		}
		await promisify(fs.rename)(req.file.path, newPath); // Renombra el archivo nuevo
		req.fileName = newFileName; // Actualiza el nombre del archivo en el objeto de solicitud

		next();
	} catch (err) {
		return res.status(500).json({ message: "Error al reemplazar la imagen." });
	}
};
