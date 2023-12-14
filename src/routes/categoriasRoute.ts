import CategoriasController from "../controllers/categoriasController";
import express from "express";
const router = express.Router();
const categoriasController = new CategoriasController();
router.get("/", categoriasController.getCategorias);
router.get("/niveles", categoriasController.getNiveles);

export default router;
