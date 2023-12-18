import express from "express";
import UsuarioController from "../controllers/usuarioController";
import ProgresoUsuarioController from "../controllers/progresoUsuarioController";

const router = express.Router();
const usuarioController = new UsuarioController();
const progresoUsuarioController = new ProgresoUsuarioController();
router.post("/signup", usuarioController.crearUsuario);
router.post("/login", usuarioController.loginUsario);
router.post("/send-verify-email", usuarioController.sendEmailToVerify);
router.get("/verify-email/:token", usuarioController.verifyEmail);
// reset password
router.post("/forgot-password", usuarioController.sendEmailToResetPassword);
router.post("/reset-password", usuarioController.verifyAndupdatePasswordFromReset);

// Actualización de datos del usuario
router.put("/update/:id", usuarioController.actualizarUsuario);
// Obtención de data del usuario
router.get("/get/:id", usuarioController.getUsuarioById);

// creación de progreso de usuario
router.post("/crear-progreso-usuario", progresoUsuarioController.crearProgresoUsuario);
router.get("/get-progreso-usuario/:id_usuario/:id_curso", progresoUsuarioController.obtenerProgresoUsuarioByIds);

export default router;
