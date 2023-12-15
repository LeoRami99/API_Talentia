import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config";
import Joi from "joi";

class Examen extends Model {
	public id!: string;
	public titulo!: string;
	public descripcion!: string;
	public estado!: string;
	public categorias!: string;
	public tiempoLimite!: number;
	public max_intentos!: number;
	public puntos!: number;
	public precio!: string;
	public preguntasOpciones!: string;
	public AdministradorId!: string;
}

Examen.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		titulo: DataTypes.STRING(128),
		descripcion: DataTypes.STRING(128),
		estado: DataTypes.STRING(128),
		categorias: DataTypes.JSON(),
		tiempoLimite: DataTypes.INTEGER,
		max_intentos: DataTypes.INTEGER,
		puntos: DataTypes.INTEGER,
		precio: DataTypes.STRING(128),
		preguntasOpciones: DataTypes.JSON(),
		AdministradorId: DataTypes.UUID,
	},
	{
		sequelize,
		tableName: "Examen",
	}
);

const schemaExamen = Joi.object({
	titulo: Joi.string().min(3).max(100).required().messages({
		"string.base": `Titulo debe ser de tipo texto`,
		"string.empty": `Titulo no puede estar vacío`,
		"string.min": `Titulo debe ser mayor a {#limit} caracteres`,
		"string.max": `Titulo debe ser menor a {#limit} caracteres`,
		"any.required": `Titulo es un campo requerido`,
	}),
	descripcion: Joi.string().min(3).max(100).required().messages({
		"string.base": `Descripcion debe ser de tipo texto`,
		"string.empty": `Descripcion no puede estar vacío`,
		"string.min": `Descripcion debe ser mayor a {#limit} caracteres`,
		"string.max": `Descripcion debe ser menor a {#limit} caracteres`,
		"any.required": `Descripcion es un campo requerido`,
	}),
	estado: Joi.boolean().required(),
	categorias: Joi.array().required().messages({
		"string.base": `Categorias debe ser de tipo texto`,
		"string.empty": `Categorias no puede estar vacío`,
		"string.min": `Categorias debe ser mayor a {#limit} caracteres`,
		"string.max": `Categorias debe ser menor a {#limit} caracteres`,
		"any.required": `Categorias es un campo requerido`,
	}),
	tiempoLimite: Joi.number().required().messages({
		"number.base": `TiempoLimite debe ser de tipo numero`,
		"number.empty": `TiempoLimite no puede estar vacío`,
		"number.min": `TiempoLimite debe ser mayor a {#limit} caracteres`,
		"number.max": `TiempoLimite debe ser menor a {#limit} caracteres`,
		"any.required": `TiempoLimite es un campo requerido`,
	}),
	max_intentos: Joi.number().required().messages({
		"number.base": `Max_intentos debe ser de tipo numero`,
		"number.empty": `Max_intentos no puede estar vacío`,
		"number.min": `Max_intentos debe ser mayor a {#limit} caracteres`,
		"number.max": `Max_intentos debe ser menor a {#limit} caracteres`,
		"any.required": `Max_intentos es un campo requerido`,
	}),
	puntos: Joi.number().required().messages({
		"number.base": `Puntos debe ser de tipo numero`,
		"number.empty": `Puntos no puede estar vacío`,
		"number.min": `Puntos debe ser mayor a {#limit} caracteres`,
		"number.max": `Puntos debe ser menor a {#limit} caracteres`,
		"any.required": `Puntos es un campo requerido`,
	}),
	precio: Joi.string().min(1).max(100).required().messages({
		"string.base": `Precio debe ser de tipo texto`,
		"string.empty": `Precio no puede estar vacío`,
		"string.min": `Precio debe ser mayor a {#limit} caracteres`,
		"string.max": `Precio debe ser menor a {#limit} caracteres`,
		"any.required": `Precio es un campo requerido`,
	}),
	preguntasOpciones: Joi.array().required().messages({
		"string.base": `PreguntasOpciones debe ser de tipo texto`,
		"string.empty": `PreguntasOpciones no puede estar vacío`,
		"string.min": `PreguntasOpciones debe ser mayor a {#limit} caracteres`,
		"string.max": `PreguntasOpciones debe ser menor a {#limit} caracteres`,
		"any.required": `PreguntasOpciones es un campo requerido`,
	}),
	adminId: Joi.string().required().min(3).max(100).messages({
		"string.base": `AdminId debe ser de tipo texto`,
		"string.empty": `AdminId no puede estar vacío`,
		"string.min": `AdminId debe ser mayor a {#limit} caracteres`,
		"string.max": `AdminId debe ser menor a {#limit} caracteres`,
		"any.required": `AdminId es un campo requerido`,
	}),
});

const opcionesSchema = Joi.object({
	orden: Joi.number().required().messages({
		"number.base": `Orden debe ser de tipo numero en opciones`,
		"number.empty": `Orden no puede estar vacío en opciones`,
		"any.required": `Orden es un campo requerido en opciones`,
	}),
	opcion: Joi.string().required().messages({
		"string.base": `Opcion debe ser de tipo texto en opciones`,
		"string.empty": `Opcion no puede estar vacío en opciones`,
		"string.min": `Opcion debe ser mayor a {#limit} caracteres`,
		"string.max": `Opcion debe ser menor a {#limit} caracteres`,
		"any.required": `Opcion es un campo requerido en opciones`,
	}),
	correcta: Joi.boolean().required().messages({
		"string.base": `Correcta debe ser de tipo texto en opciones`,
		"string.empty": `Correcta no puede estar vacío en opciones`,
		"string.min": `Correcta debe ser mayor a {#limit} caracteres en opciones`,
		"string.max": `Correcta debe ser menor a {#limit} caracteres en opciones`,
		"any.required": `Correcta es un campo requerido en opciones`,
	}),
});

// Esquema para IPregunta
const preguntasSchema = Joi.object({
	orden: Joi.number().required().messages({
		"number.base": `Orden debe ser de tipo numero en preguntas`,
		"number.empty": `Orden no puede estar vacío en preguntas`,
		"number.min": `Orden debe ser mayor a {#limit} caracteres en preguntas`,
		"number.max": `Orden debe ser menor a {#limit} caracteres en preguntas`,
		"any.required": `Orden es un campo requerido en preguntas`,
	}),
	pregunta: Joi.string().required().messages({
		"string.base": `Pregunta debe ser de tipo texto en preguntas`,
		"string.empty": `Pregunta no puede estar vacío en preguntas`,
		"string.min": `Pregunta debe ser mayor a {#limit} caracteres en preguntas`,
		"string.max": `Pregunta debe ser menor a {#limit} caracteres en preguntas`,
		"any.required": `Pregunta es un campo requerido en preguntas`,
	}),
	opciones: Joi.array().items(opcionesSchema).optional(),
});

const preguntasOpcionesSchema = Joi.object({
	preguntasOpciones: Joi.array().items(preguntasSchema).required(),
});

export { Examen, schemaExamen, preguntasSchema, opcionesSchema, preguntasOpcionesSchema };
