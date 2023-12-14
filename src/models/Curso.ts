import { Model, DataTypes } from "sequelize";
import Joi from "joi";
import { sequelize } from "../config";
import { Administrador } from "./Administrador";

class Curso extends Model {
	public id!: string;
	public titulo!: string;
	public descripcion!: string;
	public precio!: number;
	public imagen_url!: string;
	public categoria!: string;
	public nivel!: string;
	// public requisitos!: string;
	public modulos_lecciones!: string;
	public estado!: string;
	// public id_administrador!: string;
	public codigo_acceso!: string;
	public puntuacion_curso!: number;
}

Curso.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
			allowNull: false,
			unique: true,
		},
		titulo: DataTypes.STRING(128),
		descripcion: DataTypes.STRING(128),
		precio: DataTypes.INTEGER,
		imagen_url: DataTypes.STRING(128),
		categoria: DataTypes.STRING(128),
		nivel: DataTypes.STRING(128),
		// requisitos: DataTypes.JSON,
		modulos_lecciones: DataTypes.JSON,
		estado: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		codigo_acceso: DataTypes.STRING(128),
		puntuacion_curso: DataTypes.INTEGER,
	},
	{
		tableName: "Curso",
		sequelize: sequelize,
	}
);
const schemaCurso = Joi.object({
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
	precio: Joi.number().min(0).max(1000000).required().messages({
		"number.base": `Precio debe ser de tipo numérico`,
		"number.empty": `Precio no puede estar vacío`,
		"number.min": `Precio debe ser mayor a {#limit}`,
		"number.max": `Precio debe ser menor a {#limit}`,
		"any.required": `Precio es un campo requerido`,
	}),
	// imagen_url: Joi.string().min(3).max(30).optional().messages({
	// 	"string.base": `Imagen_url debe ser de tipo texto`,
	// 	"string.empty": `Imagen_url no puede estar vacío`,
	// 	"string.min": `Imagen_url debe ser mayor a {#limit} caracteres`,
	// 	"string.max": `Imagen_url debe ser menor a {#limit} caracteres`,
	// 	"any.required": `Imagen_url es un campo requerido`,
	// }),
	categoria: Joi.string().min(3).max(30).required().messages({
		"string.base": `Categoria debe ser de tipo texto`,
		"string.empty": `Categoria no puede estar vacío`,
		"string.min": `Categoria debe ser mayor a {#limit} caracteres`,
		"string.max": `Categoria debe ser menor a {#limit} caracteres`,
		"any.required": `Categoria es un campo requerido`,
	}),
	nivel: Joi.string().min(3).max(30).required().messages({
		"string.base": `Nivel debe ser de tipo texto`,
		"string.empty": `Nivel no puede estar vacío`,
		"string.min": `Nivel debe ser mayor a {#limit} caracteres`,
		"string.max": `Nivel debe ser menor a {#limit} caracteres`,
		"any.required": `Nivel es un campo requerido`,
	}),
	modulos_lecciones: Joi.array().optional(),
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
	// administrador id no esta definido en la tabla por que es un campo foraneo pero debo pedirlo
	AdministradorId: Joi.string().required(),
});

export { Curso, schemaCurso };
