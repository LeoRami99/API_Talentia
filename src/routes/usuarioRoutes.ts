import express from "express";
import UsuarioController from "../controllers/usuarioController";
import ProgresoUsuarioController from "../controllers/progresoUsuarioController";
import Examen from "../controllers/examenController";

const router = express.Router();
const usuarioController = new UsuarioController();
const progresoUsuarioController = new ProgresoUsuarioController();
const examenController = new Examen();
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
router.put("/actualizar-progreso-usuario/:id_usuario/:id_curso", progresoUsuarioController.actualizarProgresoUsuario);

// Progreso del examane
router.post("/crear-progreso", examenController.createProgresoExamen);
router.get("/get-progreso-examen/:id_usuario/:id_examen", examenController.getProgresoExamen);

// cursos donde el usuario esta inscrito a los cursos
router.get("/cursos-inscritos/:id_usuario", usuarioController.getCursosUsuario);

export default router;
