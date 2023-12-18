import express from "express";
import ExamenController from "../controllers/examenController";

const router = express.Router();
const examenController = new ExamenController();

router.get("/", examenController.getAllExamenesSinPreguntas);
router.post("/crear", examenController.createExamen);
router.put("/actualizar/:id", examenController.updateDataExamen);
router.put("/actualizar-preguntas-opciones/:id", examenController.updatePreguntasOpcionesExamen);
router.get("/get-admin/:id", examenController.getExamenesByIdAdmin);
router.get("/get/:id", examenController.getExamenById);

// Creación de progreso del examen para el usuario
router.post("/crear-progreso", examenController.createProgresoExamen);

export default router;
