import { Model, DataTypes } from "sequelize";
import { Curso } from "./Curso";
import { Usuario } from "./Usuario";

import { sequelize } from "../config";

import Joi from "joi";

class ProgresoUsuario extends Model {
	public id!: string;
	public UsuarioId!: string;
	public CursoId!: string;
	public progreso!: number;
	public completado!: boolean;
}
ProgresoUsuario.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		UsuarioId: {
			type: DataTypes.UUID,
			references: {
				model: Usuario,
				key: "id",
			},
		},
		CursoId: {
			type: DataTypes.UUID,
			references: {
				model: Curso,
				key: "id",
			},
		},
		progreso: DataTypes.JSON,
		completado: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
	},
	{
		sequelize,
		tableName: "ProgresoUsuario",
	}
);

const schemaProgresoUsuario = Joi.object({
	usuarioID: Joi.string().required().messages({
		"string.base": `UsuarioId debe ser de tipo texto`,
		"string.empty": `UsuarioId no puede estar vacío`,
		"any.required": `UsuarioId es un campo requerido`,
	}),
	cursoID: Joi.string().required().messages({
		"string.base": `CursoId debe ser de tipo texto`,
		"string.empty": `CursoId no puede estar vacío`,
		"any.required": `CursoId es un campo requerido`,
	}),
	progreso: Joi.array().required().messages({
		"string.base": `Progreso debe ser de tipo texto`,
		"string.empty": `Progreso no puede estar vacío`,
		"any.required": `Progreso es un campo requerido`,
	}),
	// completado: Joi.boolean().optional().messages({
	// 	"string.base": `Completado debe ser de tipo texto`,
	// 	"string.empty": `Completado no puede estar vacío`,
	// 	"any.required": `Completado es un campo requerido`,
	// }),
});

export { ProgresoUsuario, schemaProgresoUsuario };
