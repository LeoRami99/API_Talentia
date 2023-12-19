import { Request, Response } from "express";
import { Curso, schemaCurso } from "../models/Curso";
import { Administrador } from "../models/Administrador";
import Joi from "joi";
import { ICurso, ILecciones, IModulos_lecciones } from "../Interfaces/interfaceCurso";
import { CursoExamen } from "../models/CursoExamen";
import { Examen } from "../models/Examen";
// import jwt from "jsonwebtoken";

class CursoController {
	crearCurso = async (req: Request, res: Response) => {
		try {
			const { error } = schemaCurso.validate(req.body);
			if (error) {
				return res.status(400).json({
					error: error.details[0].message,
				});
			}
			const { titulo, descripcion, precio, categoria, nivel, codigo_acceso, puntuacion_curso, modulos_lecciones, AdministradorId } = req.body;
			if (AdministradorId === undefined || AdministradorId === null || AdministradorId === "") {
				return res.status(400).json({
					error: "Id administrador no puede estar vacío",
				});
			}
			const admin_exist = await Administrador.findOne({ where: { id: AdministradorId } });
			if (!admin_exist) {
				return res.status(400).json({
					error: "Administrador no existe",
				});
			}
			const createdCurso = await Curso.create(
				{
					titulo,
					descripcion,
					precio,
					categoria,
					nivel,
					codigo_acceso,
					puntuacion_curso,
					modulos_lecciones,
					AdministradorId,
				},
				{ fields: ["titulo", "descripcion", "precio", "categoria", "nivel", "codigo_acceso", "puntuacion_curso", "modulos_lecciones", "AdministradorId"] }
			);
			if (createdCurso) {
				return res.status(201).json({
					message: "Curso creado exitosamente",
				});
			} else {
				return res.status(400).json({
					error: "Error al crear curso",
				});
			}
		} catch (error) {
			console.log(error);
			return res.status(500).json({
				error: "Error en el servidor",
			});
		}
	};
	getCursoModuloLecciones = async (req: Request, res: Response) => {
		try {
			const schemaGetCursoModuloLecciones = Joi.object({
				id_curso: Joi.string().required(),
				id_administrador: Joi.string().required(),
			});
			const { error } = schemaGetCursoModuloLecciones.validate(req.body);
			if (error) {
				return res.status(400).json({
					error: error.details[0].message,
				});
			}
			const { id_curso, id_administrador } = req.body;
			const modulo_lecciones = await Curso.findOne({ where: { id: id_curso, AdministradorId: id_administrador }, attributes: ["modulos_lecciones"] });
			if (!modulo_lecciones) {
				return res.status(400).json({
					error: "Módulos y lecciones no existen",
				});
			}
			// parsear a JSON
			const modulos_lecciones: IModulos_lecciones = JSON.parse(modulo_lecciones.modulos_lecciones);

			return res.status(200).json({
				modulos_lecciones,
			});
		} catch (error) {
			console.debug(error);
			res.status(500).json({
				error: "Error en el servidor",
			});
		}
	};
	getCursoModuloLeccionesUsuario = async (req: Request, res: Response) => {
		try {
			const schemaGetCursoModuloLeccionesUsuario = Joi.object({
				id_curso: Joi.string().required(),
			});
			const { error } = schemaGetCursoModuloLeccionesUsuario.validate(req.body);
			if (error) {
				return res.status(400).json({
					error: error.details[0].message,
				});
			}
			const { id_curso } = req.body;
			const modulo_lecciones = await Curso.findOne({ where: { id: id_curso }, attributes: ["modulos_lecciones"] });
			if (!modulo_lecciones) {
				return res.status(400).json({
					error: "Módulos y lecciones no existen",
				});
			}
			// parsear a JSON
			const modulos_lecciones: IModulos_lecciones = JSON.parse(modulo_lecciones.modulos_lecciones);

			return res.status(200).json({
				modulos_lecciones,
			});
		} catch (error) {
			console.debug(error);
			res.status(500).json({
				error: "Error en el servidor",
			});
		}
	};
	getCursos = async (req: Request, res: Response) => {
		try {
			const cursos = await Curso.findAll({
				where: { estado: true },
				attributes: {
					exclude: ["AdministradorId"],
				},
			});

			if (cursos.length > 0) {
				const cursos_json: ICurso[] = cursos.map((curso) => {
					// Convierte el curso a un objeto JSON
					const cursoObj = curso.get({ plain: true });

					// Convierte el string de modulos_lecciones a JSON, si existe
					if (cursoObj.modulos_lecciones && typeof cursoObj.modulos_lecciones === "string") {
						cursoObj.modulos_lecciones = JSON.parse(cursoObj.modulos_lecciones);
					}

					return cursoObj;
				});

				return res.status(200).json({ cursos: cursos_json });
			} else {
				return res.status(404).json({ error: "No existen cursos" });
			}
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Error en el servidor" });
		}
	};

	updateCurso = async (req: Request, res: Response) => {
		try {
			const { id_curso } = req.params;
			const schemaUpdateCurso = Joi.object({
				titulo: Joi.string().min(3).max(80).required().messages({
					"string.base": `Titulo debe ser de tipo texto`,
					"string.empty": `Titulo no puede estar vacío`,
					"string.min": `Titulo debe ser mayor a {#limit} caracteres`,
					"string.max": `Titulo debe ser menor a {#limit} caracteres`,
					"any.required": `Titulo es un campo requerido`,
				}),
				descripcion: Joi.string().min(3).max(500).required().messages({
					"string.base": `Descripcion debe ser de tipo texto`,
					"string.empty": `Descripcion no puede estar vacío`,
					"string.min": `Descripcion debe ser mayor a {#limit} caracteres`,
					"string.max": `Descripcion debe ser menor a {#limit} caracteres`,
					"any.required": `Descripcion es un campo requerido`,
				}),
				estado: Joi.boolean().required().messages({
					"string.base": `Estado debe ser de tipo booleano`,
					"string.empty": `Estado no puede estar vacío`,
					"any.required": `Estado es un campo requerido`,
				}),
				imagen_url: Joi.string().min(3).max(1000000).required().messages({
					"string.base": `Imagen_url debe ser de tipo texto`,
					"string.empty": `Imagen_url no puede estar vacío`,
					"string.min": `Imagen_url debe ser mayor a {#limit} caracteres`,
					"string.max": `Imagen_url debe ser menor a {#limit} caracteres`,
					"any.required": `Imagen_url es un campo requerido`,
				}),
				precio: Joi.number().min(0).max(1000000).required().messages({
					"number.base": `Precio debe ser de tipo numérico`,
					"number.empty": `Precio no puede estar vacío`,
					"number.min": `Precio debe ser mayor a {#limit}`,
					"number.max": `Precio debe ser menor a {#limit}`,
					"any.required": `Precio es un campo requerido`,
				}),
				categoria: Joi.string().min(3).max(80).required().messages({
					"string.base": `Categoria debe ser de tipo texto`,
					"string.empty": `Categoria no puede estar vacío`,
					"string.min": `Categoria debe ser mayor a {#limit} caracteres`,
					"string.max": `Categoria debe ser menor a {#limit} caracteres`,
					"any.required": `Categoria es un campo requerido`,
				}),
				nivel: Joi.string()
					.min(3)
					.max(80)
					.required()
					.messages({
						"string.base": `Nivel debe ser de tipo texto`,
						"string.empty": `Nivel no puede estar vacío`,
						"string.min": `Nivel debe ser mayor a {#limit} caracteres`,
						"string.max": `Nivel
					debe ser menor a {#limit} caracteres`,
						"any.required": `Nivel es un campo requerido`,
					}),
				codigo_acceso: Joi.string().min(3).max(30).required().messages({
					"string.base": `Codigo_acceso debe ser de tipo texto`,
					"string.empty": `Codigo_acceso no puede estar vacío`,
					"string.min": `Codigo_acceso debe ser mayor a {#limit} caracteres`,
					"string.max": `Codigo_acceso debe ser menor a {#limit} caracteres`,
					"any.required": `Codigo_acceso es un campo requerido`,
				}),
				puntuacion_curso: Joi.number().min(0).max(1000000).required().messages({
					"number.base": `Puntuacion_curso debe ser de tipo numérico`,
					"number.empty": `Puntuacion_curso no puede estar vacío`,
					"number.min": `Puntuacion_curso debe ser mayor a {#limit}`,
					"number.max": `Puntuacion_curso debe ser menor a {#limit}`,
					"any.required": `Puntuacion_curso es un campo requerido`,
				}),
			});
			const { error } = schemaUpdateCurso.validate(req.body);
			if (error) {
				return res.status(400).json({
					error: error.details[0].message,
				});
			}
			const { titulo, imagen_url, estado, descripcion, precio, categoria, nivel, codigo_acceso, puntuacion_curso } = req.body;
			const curso_exist = await Curso.findOne({ where: { id: id_curso } });
			if (!curso_exist) {
				return res.status(400).json({
					error: "Curso no existe",
				});
			}
			const updatedCurso = await Curso.update(
				{
					titulo,
					descripcion,
					imagen_url,
					estado,
					precio,
					categoria,
					nivel,
					codigo_acceso,
					puntuacion_curso,
				},
				{ where: { id: id_curso } }
			);
			if (updatedCurso) {
				return res.status(200).json({
					message: "Curso actualizado exitosamente",
				});
			} else {
				return res.status(400).json({
					error: "Error al actualizar curso",
				});
			}
		} catch (error) {
			console.debug(error);
			res.status(500).json({
				error: "Error en el servidor",
			});
		}
	};
	updateModulosLecciones = async (req: Request, res: Response) => {
		try {
			const { id_curso } = req.params;
			const schemaUpdateModulosLecciones = Joi.object({
				id_administrador: Joi.string().required(),
				modulos_lecciones: Joi.array().required(),
			});
			const { error } = schemaUpdateModulosLecciones.validate(req.body);
			if (error) {
				return res.status(400).json({
					error: error.details[0].message,
				});
			}
			const { id_administrador, modulos_lecciones } = req.body;
			const curso_exist = await Curso.findOne({ where: { id: id_curso, AdministradorId: id_administrador } });
			if (!curso_exist) {
				return res.status(400).json({
					error: "Curso no existe",
				});
			}
			const updatedCurso = await Curso.update(
				{
					modulos_lecciones,
				},
				{ where: { id: id_curso } }
			);
			if (updatedCurso) {
				return res.status(200).json({
					message: "Curso actualizado exitosamente",
				});
			} else {
				return res.status(400).json({
					error: "Error al actualizar curso",
				});
			}
		} catch (error) {
			console.debug(error);
			res.status(500).json({
				error: "Error en el servidor",
			});
		}
	};
	getCursoById = async (req: Request, res: Response) => {
		try {
			const { id_curso } = req.params;
			const curso = await Curso.findOne({
				where: { id: id_curso },
				attributes: { exclude: ["AdministradorId"] },
			});

			// Verificar primero si el curso existe antes de intentar parsear
			if (!curso) {
				return res.status(400).json({
					error: "Curso no existe",
				});
			}

			try {
				// Intentar parsear 'modulos_lecciones' si existe en el curso
				if (curso.modulos_lecciones) {
					curso.modulos_lecciones = JSON.parse(curso.modulos_lecciones);
				}
			} catch (parseError) {
				console.error("Error al parsear modulos_lecciones:", parseError);
				// Podemos decidir si queremos enviar este error al cliente o no
			}

			return res.status(200).json({ curso });
		} catch (error) {
			console.error("Error en el servidor:", error);
			res.status(500).json({
				error: "Error en el servidor",
			});
		}
	};
	getExamenCursoById = async (req: Request, res: Response) => {
		try {
			const { id_curso } = req.params;
			const examenes = await CursoExamen.findAll({
				where: { cursoId: id_curso },
			});
			if (examenes.length > 0) {
				return res.status(200).json({ examenes });
			} else {
				return res.status(404).json({ error: "No existen examenes para este curso" });
			}
		} catch (error) {
			console.error("Error en el servidor:", error);
			res.status(500).json({
				error: "Error en el servidor",
			});
		}
	};
	crearCursoExamen = async (req: Request, res: Response) => {
		try {
			const schemaCrearCursoExamen = Joi.object({
				cursoId: Joi.string().required().messages({
					"string.base": `CursoId debe ser de tipo texto`,
					"string.empty": `CursoId no puede estar vacío`,
					"any.required": `CursoId es un campo requerido`,
				}),
				examenId: Joi.string().required().messages({
					"string.base": `ExamenId debe ser de tipo texto`,
					"string.empty": `ExamenId no puede estar vacío`,
					"any.required": `ExamenId es un campo requerido`,
				}),
			});
			const { error } = schemaCrearCursoExamen.validate(req.body);
			if (error) {
				return res.status(400).json({
					error: error.details[0].message,
				});
			}
			const { cursoId, examenId } = req.body;
			const curso_exist = await Curso.findOne({ where: { id: cursoId } });
			if (!curso_exist) {
				return res.status(400).json({
					error: "Curso no existe",
				});
			}
			const examen_exist = await Examen.findOne({ where: { id: examenId } });
			if (!examen_exist) {
				return res.status(400).json({
					error: "Examen no existe",
				});
			}

			const examen_curso = await CursoExamen.findOne({ where: { cursoId, examenId } });
			if (examen_curso) {
				return res.status(400).json({
					error: "Relación Curso Examen ya existe",
				});
			}
			const createdCursoExamen = await CursoExamen.create(
				{
					cursoId,
					examenId,
				},
				{ fields: ["cursoId", "examenId"] }
			);
			if (createdCursoExamen) {
				return res.status(201).json({
					message: "Relación Curso Examen creado exitosamente",
				});
			} else {
				return res.status(400).json({
					error: "Error al crear CursoExamen",
				});
			}
		} catch (error) {
			console.debug(error);
			res.status(500).json({
				error: "Error en el servidor",
			});
		}
	};
	updateCursoExamen = async (req: Request, res: Response) => {
		try {
			const { id_curso, id_examen } = req.params;
			const schemaUpdateCursoExamen = Joi.object({
				cursoId: Joi.string().required().messages({
					"string.base": `CursoId debe ser de tipo texto`,
					"string.empty": `CursoId no puede estar vacío`,
					"any.required": `CursoId es un campo requerido`,
				}),
				examenId: Joi.string().required().messages({
					"string.base": `ExamenId debe ser de tipo texto`,
					"string.empty": `ExamenId no puede estar vacío`,
					"any.required": `ExamenId es un campo requerido`,
				}),
			});
			const { error } = schemaUpdateCursoExamen.validate(req.body);
			if (error) {
				return res.status(400).json({
					error: error.details[0].message,
				});
			}

			const { cursoId, examenId } = req.body;

			// Verificar si el curso existe
			const curso_exist = await Curso.findOne({ where: { id: cursoId } });
			if (!curso_exist) {
				return res.status(400).json({
					error: "Curso no existe",
				});
			}

			// Verificar si el examen existe
			const examen_exist = await Examen.findOne({ where: { id: examenId } });
			if (!examen_exist) {
				return res.status(400).json({
					error: "Examen no existe",
				});
			}

			// Verificar si el examen ya está asignado a otro curso
			const examenAsignado = await CursoExamen.findOne({ where: { examenId } });
			if (examenAsignado) {
				return res.status(400).json({
					error: "El examen ya está asignado a otro curso",
				});
			}
			// Actualizar la relación Curso-Examen
			const updatedCursoExamen = await CursoExamen.update({ cursoId, examenId }, { where: { cursoId: id_curso, examenId: id_examen } });
			if (updatedCursoExamen) {
				return res.status(200).json({
					message: "Relación Curso-Examen actualizado exitosamente",
				});
			} else {
				return res.status(400).json({
					error: "Error al actualizar CursoExamen",
				});
			}
		} catch (error) {
			console.debug(error);
			res.status(500).json({
				error: "Error en el servidor",
			});
		}
	};
}

export default CursoController;
