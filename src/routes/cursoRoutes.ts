import express from "express";
import CursoController from "../controllers/cursoController";

const router = express.Router();

const cursoController = new CursoController();

// creación del curso
router.get("/", cursoController.getCursos);
router.post("/crear", cursoController.crearCurso);
router.get("/modulos-lecciones", cursoController.getCursoModuloLecciones);
router.put("/actualizar/:id_curso", cursoController.updateCurso);
router.put("/actualizar-modulos-lecciones/:id_curso", cursoController.updateModulosLecciones);

// obtener todos los cursos

// Esta es para la los usuarios
router.get("/modulos-lecciones-usuario", cursoController.getCursoModuloLeccionesUsuario);

export default router;
