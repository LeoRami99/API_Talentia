import express from "express";
import AdministradorController from "../controllers/administradorController";

const router = express.Router();
const administradorController = new AdministradorController();
router.post("/signup", administradorController.crearAdministrador);

router.put("/update/:id", administradorController.updateAdministrador);
router.get("/get/:id", administradorController.getAdministradorById);

export default router;
