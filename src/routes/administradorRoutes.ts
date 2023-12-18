import express from "express";
import AdministradorController from "../controllers/administradorController";
import { checkRole, authenticateToken } from "../middlewares/authMiddleware";
// import authenticateToken from "../middlewares/authMiddleware";

const router = express.Router();
const administradorController = new AdministradorController();
router.post("/signup", administradorController.crearAdministrador);
router.post("/login", administradorController.loginAdministrador);

router.put("/update/:id", administradorController.updateAdministrador);
router.get("/get/:id", administradorController.getAdministradorById);

export default router;
