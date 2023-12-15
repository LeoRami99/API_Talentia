import { ProgresoUsuario, schemaProgresoUsuario } from "../models/ProgresoUsuario";
import { Request, Response } from "express";
import { Usuario } from "../models/Usuario";
import { Curso } from "../models/Curso";

class ProgresoUsuarioController {
	crearProgresoUsuario = async (req: Request, res: Response) => {
		try {
			const { error } = schemaProgresoUsuario.validate(req.body);
			if (error) {
				return res.status(400).json({ message: error.details[0].message });
			}
			const verificarUsuario = await Usuario.findOne({
				where: {
					id: req.body.usuarioID,
				},
			});
			const verificarCurso = await Curso.findOne({
				where: {
					id: req.body.cursoID,
				},
			});
			if (!verificarUsuario) {
				return res.status(400).json({
					message: "El usuario no existe",
				});
			}
			if (!verificarCurso) {
				return res.status(400).json({
					message: "El curso no existe",
				});
			}
			const verificarProgreso = await ProgresoUsuario.findOne({
				where: {
					UsuarioId: req.body.usuarioID,
					CursoId: req.body.cursoID,
				},
			});
			if (verificarProgreso) {
				return res.status(400).json({
					message: "El usuario ya tiene un progreso en este curso",
				});
			}
			const { usuarioID, cursoID, progreso } = req.body;
			const progresoUsuario = await ProgresoUsuario.create(
				{
					UsuarioId: usuarioID,
					CursoId: cursoID,
					progreso: progreso,
				},
				{
					fields: ["UsuarioId", "CursoId", "progreso"],
				}
			);
			console.log(progresoUsuario);
			if (progresoUsuario) {
				return res.status(201).json({
					message: "ProgresoUsuario creado correctamente",
					data: progresoUsuario,
				});
			} else {
				return res.status(500).json({
					message: "No se pudo crear el progreso del usuario",
					data: progresoUsuario,
				});
			}

			res.status(201).json({ progresoUsuario });
		} catch (error) {
			res.status(400).json(error);
		}
	};
}

export default ProgresoUsuarioController;
