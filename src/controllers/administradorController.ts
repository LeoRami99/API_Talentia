import { Request, Response } from "express";
import { Administrador, schemaAdministrador } from "../models/Administrador";
import Joi from "joi";
import jwt from "jsonwebtoken";
const bcrypt = require("bcryptjs");

class AdministradorController {
	crearAdministrador = async (req: Request, res: Response) => {
		try {
			const { error } = schemaAdministrador.validate(req.body);
			if (error) {
				return res.status(400).json({
					error: error.details[0].message,
				});
			}
			const { nombre, apellido, email, telefono, password, avatar_url } = req.body;
			const administrador = await Administrador.findOne({ where: { email } });
			if (administrador) {
				return res.status(400).json({
					error: "Administrador ya existe",
				});
			}
			const createdAdministrador = await Administrador.create(
				{
					nombre,
					apellido,
					email,
					telefono,
					password: bcrypt.hashSync(password, 10),
					avatar_url,
				},
				{ fields: ["nombre", "apellido", "email", "telefono", "avatar_url", "password"] }
			);
			if (createdAdministrador) {
				return res.status(201).json({
					message: "Administrador creado exitosamente",
				});
			} else {
				return res.status(400).json({
					error: "Error al crear administrador",
				});
			}
		} catch (error) {
			console.log(error);
			return res.status(500).json({
				error: "Error en el servidor",
			});
		}
	};
	updateAdministrador = async (req: Request, res: Response) => {
		try {
			const { id } = req.params;
			const schemaAdministradorUpdate = Joi.object({
				nombre: Joi.string().min(3).max(100).messages({
					"string.base": `Nombre debe ser de tipo texto`,
					"string.empty": `Nombre no puede estar vacío`,
					"string.min": `Nombre debe ser mayor a {#limit} caracteres`,
					"string.max": `Nombre debe ser menor a {#limit} caracteres`,
					"any.required": `Nombre es un campo requerido`,
				}),
				apellido: Joi.string().min(3).max(30).messages({
					"string.base": `Apellido debe ser de tipo texto`,
					"string.empty": `Apellido no puede estar vacío`,
					"string.min": `Apellido debe ser mayor a {#limit} caracteres`,
					"string.max": `Apellido debe ser menor a {#limit} caracteres`,
					"any.required": `Apellido es un campo requerido`,
				}),
				telefono: Joi.string().min(3).max(30).messages({
					"string.base": `Telefono debe ser de tipo texto`,
					"string.empty": `Telefono no puede estar vacío`,
					"string.min": `Telefono debe ser mayor a {#limit} caracteres`,
					"string.max": `Telefono debe ser menor a {#limit} caracteres`,
					"any.required": `Telefono es un campo requerido`,
				}),
				avatar_url: Joi.string().min(3).messages({
					"string.base": `Avatar_url debe ser de tipo texto`,
					"string.empty": `Avatar_url no puede estar vacío`,
					"string.min": `Avatar_url debe ser mayor a {#limit} caracteres`,
					"any.required": `Avatar_url es un campo requerido`,
				}),
				email: Joi.string().min(3).max(30).messages({
					"string.base": `Email debe ser de tipo texto`,
					"string.empty": `Email no puede estar vacío`,
					"string.min": `Email debe ser mayor a {#limit} caracteres`,
					"string.max": `Email debe ser menor a {#limit} caracteres`,
					"any.required": `Email es un campo requerido`,
				}),
			});
			const { error } = schemaAdministradorUpdate.validate(req.body);
			if (error) {
				return res.status(400).json({
					error: error.details[0].message,
				});
			}
			const administrador = await Administrador.findOne({ where: { id } });
			if (!administrador) {
				return res.status(400).json({
					error: "Administrador no existe",
				});
			}
			const { nombre, apellido, email, telefono, avatar_url, password } = req.body;
			const updatedAdministrador = await Administrador.update(
				{
					nombre,
					apellido,
					email,
					telefono,
					avatar_url,
				},
				{ where: { id } }
			);
			if (updatedAdministrador) {
				return res.status(200).json({
					message: "Administrador actualizado exitosamente",
				});
			} else {
				return res.status(400).json({
					error: "Error al actualizar administrador",
				});
			}
		} catch (error) {
			console.log(error);
			return res.status(500).json({
				error: "Error en el servidor",
			});
		}
	};
	getAdministradorById = async (req: Request, res: Response) => {
		try {
			const { id } = req.params;
			const administrador = await Administrador.findOne({ where: { id }, attributes: { exclude: ["password"] } });
			if (!administrador) {
				return res.status(400).json({
					error: "Administrador no existe",
				});
			}
			return res.status(200).json({
				administrador,
			});
		} catch (error) {
			console.log(error);
			return res.status(500).json({
				error: "Error en el servidor",
			});
		}
	};
}

export default AdministradorController;
