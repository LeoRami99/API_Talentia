import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config";
import Joi from "joi";

class Usuario extends Model {
	id!: string;
	nombre!: string;
	apellido!: string;
	telefono!: string;
	avatar_url!: string;
	nivel!: string;
	intereses!: string;
	email!: string;
	email_verified!: boolean;
	password!: string;
	puntuacion_global!: number;
}
Usuario.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
			allowNull: false,
			unique: true,
		},
		nombre: DataTypes.STRING(128),
		apellido: DataTypes.STRING(128),
		telefono: DataTypes.STRING(128),
		avatar_url: DataTypes.STRING(128),
		nivel: DataTypes.STRING(128),
		intereses: DataTypes.JSON,
		puntuacion_global: DataTypes.INTEGER,
		email: DataTypes.STRING(128),
		email_verified: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		password: DataTypes.STRING(128),
	},
	{
		tableName: "Usuario",
		sequelize: sequelize,
	}
);

const schemaUsuario = Joi.object({
	nombre: Joi.string().min(3).max(100).required().messages({
		"string.base": `Nombre debe ser de tipo texto`,
		"string.empty": `Nombre no puede estar vacío`,
		"string.min": `Nombre debe ser mayor a {#limit} caracteres`,
		"string.max": `Nombre debe ser menor a {#limit} caracteres`,
		"any.required": `Nombre es un campo requerido`,
	}),
	apellido: Joi.string().min(3).max(30).required().messages({
		"string.base": `Apellido debe ser de tipo texto`,
		"string.empty": `Apellido no puede estar vacío`,
		"string.min": `Apellido debe ser mayor a {#limit} caracteres`,
		"string.max": `Apellido debe ser menor a {#limit} caracteres`,
		"any.required": `Apellido es un campo requerido`,
	}),
	telefono: Joi.string().min(3).max(30).required().messages({
		"string.base": `Telefono debe ser de tipo texto`,
		"string.empty": `Telefono no puede estar vacío`,
		"string.min": `Telefono debe ser mayor a {#limit} caracteres`,
		"string.max": `Telefono debe ser menor a {#limit} caracteres`,
		"any.required": `Telefono es un campo requerido`,
	}),
	avatar_url: Joi.string().min(3).required().messages({
		"string.base": `Avatar_url debe ser de tipo texto`,
		"string.empty": `Avatar_url no puede estar vacío`,
		"string.min": `Avatar_url debe ser mayor a {#limit} caracteres`,
		"any.required": `Avatar_url es un campo requerido`,
	}),
	nivel: Joi.string().min(3).max(30).required().messages({
		"string.base": `Nivel debe ser de tipo texto`,
		"string.empty": `Nivel no puede estar vacío`,
		"string.min": `Nivel debe ser mayor a {#limit} caracteres`,
		"string.max": `Nivel debe ser menor a {#limit} caracteres`,
		"any.required": `Nivel es un campo requerido`,
	}),
	intereses: Joi.array().items(Joi.string()).required().messages({
		"string.base": `Intereses debe ser de tipo texto`,
		"string.empty": `Intereses no puede estar vacío`,
		"string.min": `Intereses debe ser mayor a {#limit} caracteres`,
		"string.max": `Intereses debe ser menor a {#limit} caracteres`,
		"any.required": `Interes es un campo requerido`,
	}),
	email: Joi.string().min(3).max(30).required().messages({
		"string.base": `Email debe ser de tipo texto`,
		"string.empty": `Email no puede estar vacío`,
		"string.min": `Email debe ser mayor a {#limit} caracteres`,
		"string.max": `Email debe ser menor a {#limit} caracteres`,
		"any.required": `Email es un campo requerido`,
	}),
	password: Joi.string().min(8).max(30).required().messages({
		"string.base": `Password debe ser de tipo texto`,
		"string.empty": `Password no puede estar vacío`,
		"string.min": `Password debe ser mayor a {#limit} caracteres`,
		"string.max": `Password debe ser menor a {#limit} caracteres`,
		"any.required": `Password es un campo requerido`,
	}),
});

export { Usuario, schemaUsuario };
