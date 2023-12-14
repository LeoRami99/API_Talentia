import express from "express";
import UsuarioController from "../controllers/usuarioController";

const router = express.Router();
const usuarioController = new UsuarioController();
router.post("/signup", usuarioController.crearUsuario);
router.post("/login", usuarioController.loginUsario);

// Actualización de datos del usuario
router.put("/update/:id", usuarioController.actualizarUsuario);
// Obtención de data del usuario
router.get("/get/:id", usuarioController.getUsuarioById);

export default router;
