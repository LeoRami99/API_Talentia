import { Examen, schemaExamen, preguntasOpcionesSchema } from "../models/Examen";
import { ProgresoExamen } from "../models/ProgresoExamen";
import { Administrador } from "../models/Administrador";
import { Usuario } from "../models/Usuario";
import { Request, Response } from "express";
import { IPregunta, IOpciones } from "../Interfaces/interfaceExamen";

class ExamenController {
	createExamen = async (req: Request, res: Response) => {
		try {
			const { error } = schemaExamen.validate(req.body);
			if (error) {
				return res.status(400).json({ message: error.details[0].message });
			}

			const { titulo, descripcion, estado, categorias, tiempoLimite, max_intentos, puntos, precio, preguntasOpciones, adminId } = req.body;

			const existAdmin = await Administrador.findByPk(adminId);
			if (!existAdmin) {
				return res.status(404).json({ message: "El administrador no existe" });
			}

			const examenCreated = await Examen.create({
				titulo,
				descripcion,
				estado,
				categorias,
				tiempoLimite,
				max_intentos,
				puntos,
				precio,
				preguntasOpciones,
				AdministradorId: adminId,
			});

			return res.status(201).json({
				message: "Examen creado correctamente",
				examen: examenCreated,
			});
		} catch (error) {
			console.error(error);
			res.status(500).json({
				message: "Error al crear el examen",
			});
		}
	};
	updateDataExamen = async (req: Request, res: Response) => {
		try {
			const { id } = req.params;
			const { titulo, descripcion, estado, categorias, tiempoLimite, max_intentos, puntos, precio, adminId } = req.body;

			const examen = await Examen.findByPk(id);
			if (!examen) {
				return res.status(404).json({ message: "El examen no existe" });
			}
			const existAdmin = await Administrador.findByPk(adminId);
			if (!existAdmin) {
				return res.status(404).json({ message: "El administrador no existe" });
			}
			const examenUpdated = await examen.update({
				titulo,
				descripcion,
				estado,
				categorias,
				tiempoLimite,
				max_intentos,
				puntos,
				precio,
			});

			return res.status(200).json({
				message: "Examen actualizado correctamente",
				examen: examenUpdated,
			});
		} catch (error) {
			console.error(error);
			res.status(500).json({
				message: "Error al actualizar el examen",
			});
		}
	};
	updatePreguntasOpcionesExamen = async (req: Request, res: Response) => {
		try {
			const { id } = req.params;
			const examen = await Examen.findByPk(id);
			if (!examen) {
				return res.status(404).json({ message: "El examen no existe" });
			}
			const { error } = preguntasOpcionesSchema.validate(req.body);
			if (error) {
				return res.status(400).json({ message: error.details[0].message });
			}
			const { preguntasOpciones } = req.body;

			const examenUpdated = await examen.update({
				preguntasOpciones,
			});
			if (examenUpdated) {
				return res.status(200).json({
					message: "Examen actualizado correctamente",
				});
			} else {
				return res.status(500).json({
					message: "Error al actualizar el examen",
				});
			}
		} catch (error) {
			console.error(error);
			res.status(500).json({
				message: "Error al actualizar el examen",
			});
		}
	};
	getExamenesByIdAdmin = async (req: Request, res: Response) => {
		try {
			const { id } = req.params;
			const examenes = await Examen.findAll({
				where: { AdministradorId: id },
			});

			if (examenes.length > 0) {
				const examenesJson = examenes.map((examen) => {
					// Convierte el examen a un objeto JSON
					const examenObj = examen.get({ plain: true });

					if (examenObj.categorias && typeof examenObj.categorias === "string") {
						examenObj.categorias = JSON.parse(examenObj.categorias);
					}
					// Convierte el string de preguntasOpciones a JSON, si existe
					if (examenObj.preguntasOpciones && typeof examenObj.preguntasOpciones === "string") {
						examenObj.preguntasOpciones = JSON.parse(examenObj.preguntasOpciones);
					}

					return examenObj;
				});

				return res.status(200).json({
					message: "Examenes encontrados",
					examenes: examenesJson,
				});
			} else {
				return res.status(404).json({
					message: "No se encontraron examenes",
				});
			}
		} catch (error) {
			console.error(error);
			res.status(500).json({
				message: "Error al obtener los examenes",
			});
		}
	};
	getAllExamenesSinPreguntas = async (req: Request, res: Response) => {
		try {
			const examenes = await Examen.findAll({
				attributes: { exclude: ["preguntasOpciones", "AdministradorId"] },
				where: { estado: true },
			});
			if (examenes.length > 0) {
				const examenesJson = examenes.map((examen) => {
					// Convierte el examen a un objeto JSON
					const examenObj = examen.get({ plain: true });

					if (examenObj.categorias && typeof examenObj.categorias === "string") {
						examenObj.categorias = JSON.parse(examenObj.categorias);
					}

					return examenObj;
				});

				return res.status(200).json({
					message: "Examenes encontrados",
					examenes: examenesJson,
				});
			} else {
				return res.status(404).json({
					message: "No se encontraron examenes",
				});
			}
		} catch (error) {
			console.error(error);
			res.status(500).json({
				message: "Error al obtener los examenes",
			});
		}
	};
	getExamenById = async (req: Request, res: Response) => {
		try {
			const { id } = req.params;
			const examen = await Examen.findOne({
				where: { id, estado: true },
				attributes: { exclude: ["AdministradorId"] },
			});
			if (!examen) {
				return res.status(404).json({
					message: "No se encontró el examen",
				});
			}
			const examenJson = examen.get({ plain: true });
			if (examenJson.categorias && typeof examenJson.categorias === "string") {
				examenJson.categorias = JSON.parse(examenJson.categorias);
			}
			if (examenJson.preguntasOpciones && typeof examenJson.preguntasOpciones === "string") {
				examenJson.preguntasOpciones = JSON.parse(examenJson.preguntasOpciones);
			}
			return res.status(200).json({
				message: "Examen encontrado",
				examen: examenJson,
			});
		} catch (error) {
			console.error(error);
			res.status(500).json({
				message: "Error al obtener el examen",
			});
		}
	};

	// progreso del examen
	createProgresoExamen = async (req: Request, res: Response) => {
		try {
			const { usuarioID, examenID } = req.body;

			const existExamen = await Examen.findByPk(examenID);
			if (!existExamen) {
				return res.status(404).json({ message: "El examen no existe" });
			}
			const existUsuario = await Usuario.findByPk(usuarioID);
			if (!existUsuario) {
				return res.status(404).json({ message: "El usuario no existe" });
			}
			// Aquí se valida que el usuario no tenga un progreso de este examen
			const progresoExamenExist = await ProgresoExamen.findOne({
				where: { UsuarioId: usuarioID, ExamenId: examenID },
			});
			if (progresoExamenExist) {
				return res.status(400).json({
					message: "El usuario ya tiene un progreso de este examen",
				});
			}
			const progresoExamen = await ProgresoExamen.create({
				UsuarioId: usuarioID,
				ExamenId: examenID,
			});
			if (progresoExamen) {
				res.status(201).json({
					message: "Progreso del examen creado correctamente",
					progresoExamen,
				});
			} else {
				return res.status(500).json({
					message: "Error al crear el progreso del examen",
				});
			}
		} catch (error) {
			console.error(error);
			res.status(500).json({
				message: "Error al crear el progreso del examen",
			});
		}
	};
}

export default ExamenController;
