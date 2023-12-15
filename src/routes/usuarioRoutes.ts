import express from "express";
import UsuarioController from "../controllers/usuarioController";
import ProgresoUsuarioController from "../controllers/progresoUsuarioController";

const router = express.Router();
const usuarioController = new UsuarioController();
const progresoUsuarioController = new ProgresoUsuarioController();
router.post("/signup", usuarioController.crearUsuario);
router.post("/login", usuarioController.loginUsario);

// Actualización de datos del usuario
router.put("/update/:id", usuarioController.actualizarUsuario);
// Obtención de data del usuario
router.get("/get/:id", usuarioController.getUsuarioById);

// creación de progreso de usuario

router.post("/crear-progreso-usuario", progresoUsuarioController.crearProgresoUsuario);

export default router;
