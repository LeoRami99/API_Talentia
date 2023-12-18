import express, { Request, Response } from "express";
import { uploadImageMiddleware, checkImageSizeMiddleware, replaceImageMiddleware } from "../middlewares/imgUploadMiddleware";

interface CustomRequest extends Request {
	fileName?: string;
}

const router = express.Router();

router.post("/subir-imagen", uploadImageMiddleware, checkImageSizeMiddleware, (req: CustomRequest, res: Response) => {
	const { fileName } = req; // Destructure the 'fileName' property from the 'req' object
	return res.status(200).json({ message: "Imagen subida correctamente.", fileName });
});

router.put("/actualizar-imagen", uploadImageMiddleware, checkImageSizeMiddleware, replaceImageMiddleware, (req: CustomRequest, res: Response) => {
	const { fileName } = req; // Destructure the 'fileName' property from the 'req' object
	return res.status(200).json({ message: "Imagen actualizada correctamente.", fileName });
});

export default router;
