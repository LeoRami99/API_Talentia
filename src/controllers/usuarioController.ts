import { Usuario, schemaUsuario } from "../models/Usuario";
import { Request, Response } from "express";
import Joi from "joi";
import jwt from "jsonwebtoken";
const bcrypt = require("bcryptjs");

class UsuarioController {
	crearUsuario = async (req: Request, res: Response) => {
		try {
			const { error } = schemaUsuario.validate(req.body);
			if (error) {
				return res.status(400).json({
					error: error.details[0].message,
				});
			}
			const { nombre, apellido, email, telefono, password, avatar_url, nivel, intereses } = req.body;
			const usuario = await Usuario.findOne({ where: { email } });
			if (usuario) {
				return res.status(400).json({
					error: "Usuario ya existe",
				});
			}
			const createdUsuario = await Usuario.create(
				{
					nombre,
					apellido,
					email,
					telefono,
					password: bcrypt.hashSync(password, 10),
					avatar_url,
					nivel,
					intereses,
				},
				{ fields: ["nombre", "apellido", "email", "telefono", "password", "avatar_url", "nivel", "intereses"] }
			);
			if (createdUsuario) {
				return res.status(201).json({
					message: "Usuario creado exitosamente",
				});
			} else {
				return res.status(400).json({
					error: "Error al crear usuario",
				});
			}
		} catch (error) {
			console.log(error);
			return res.status(500).json({
				error: "Error en el servidor",
			});
		}
	};
	actualizarUsuario = async (req: Request, res: Response) => {
		try {
			const { id } = req.params;
			const schemaUsuarioUpdae = Joi.object({
				nombre: Joi.string().min(3).max(100).messages({
					"string.base": `Nombre debe ser de tipo texto`,
					"string.empty": `Nombre no puede estar vacío`,
					"string.min": `Nombre debe ser mayor a {#limit} caracteres`,
					"string.max": `Nombre debe ser menor a {#limit} caracteres`,
				}),
				apellido: Joi.string().min(3).max(30).messages({
					"string.base": `Apellido debe ser de tipo texto`,
					"string.empty": `Apellido no puede estar vacío`,
					"string.min": `Apellido debe ser mayor a {#limit} caracteres`,
					"string.max": `Apellido debe ser menor a {#limit} caracteres`,
				}),
				telefono: Joi.string().min(3).max(30).messages({
					"string.base": `Telefono debe ser de tipo texto`,
					"string.empty": `Telefono no puede estar vacío`,
					"string.min": `Telefono debe ser mayor a {#limit} caracteres`,
					"string.max": `Telefono debe ser menor a {#limit} caracteres`,
				}),
				avatar_url: Joi.string().min(3).messages({
					"string.base": `Avatar_url debe ser de tipo texto`,
					"string.empty": `Avatar_url no puede estar vacío`,
					"string.min": `Avatar_url debe ser mayor a {#limit} caracteres`,
				}),
				nivel: Joi.string().min(3).max(30).messages({
					"string.base": `Nivel debe ser de tipo texto`,
					"string.empty": `Nivel no puede estar vacío`,
					"string.min": `Nivel debe ser mayor a {#limit} caracteres`,
					"string.max": `Nivel debe ser menor a {#limit} caracteres`,
				}),
				intereses: Joi.array().items(Joi.string()).messages({
					"string.base": `Intereses debe ser de tipo texto`,
					"string.empty": `Intereses no puede estar vacío`,
					"string.min": `Intereses debe ser mayor a {#limit} caracteres`,
					"string.max": `Intereses debe ser menor a {#limit} caracteres`,
				}),
				email: Joi.string().min(3).max(30).messages({
					"string.base": `Email debe ser de tipo texto`,
					"string.empty": `Email no puede estar vacío`,
					"string.min": `Email debe ser mayor a {#limit} caracteres`,
					"string.max": `Email debe ser menor a {#limit} caracteres`,
				}),
			});
			const { error } = schemaUsuarioUpdae.validate(req.body);
			if (error) {
				return res.status(400).json({
					error: error.details[0].message,
				});
			}
			const { nombre, apellido, email, telefono, avatar_url, nivel, intereses } = req.body;
			const usuario = await Usuario.findOne({ where: { id } });
			if (!usuario) {
				return res.status(400).json({
					error: "Usuario no existe",
				});
			}
			const updatedUsuario = await Usuario.update(
				{
					nombre,
					apellido,
					email,
					telefono,
					avatar_url,
					nivel,
					intereses,
				},
				{ where: { id } }
			);
			if (updatedUsuario) {
				return res.status(200).json({
					message: "Usuario actualizado exitosamente",
				});
			} else {
				return res.status(400).json({
					error: "Error al actualizar usuario",
				});
			}
		} catch (error) {
			console.log(error);
			return res.status(500).json({
				error: "Error en el servidor",
			});
		}
	};
	getUsuarioById = async (req: Request, res: Response) => {
		try {
			const { id } = req.params;
			const usuario = await Usuario.findOne({ where: { id }, attributes: { exclude: ["password"] } });
			if (!usuario) {
				return res.status(400).json({
					error: "Usuario no existe",
				});
			}
			// parsear intereses a json array
			usuario.intereses = JSON.parse(usuario.intereses);

			return res.status(200).json({
				usuario,
			});
		} catch (error) {
			console.log(error);
			return res.status(500).json({
				error: "Error en el servidor",
			});
		}
	};
	loginUsario = async (req: Request, res: Response) => {
		try {
			const schemaUsuarioLogin = Joi.object({
				email: Joi.string().min(3).max(200).required().messages({
					"string.base": `Email debe ser de tipo texto`,
					"string.empty": `Email no puede estar vacío`,
					"string.min": `Email debe ser mayor a {#limit} caracteres`,
					"string.max": `Email debe ser menor a {#limit} caracteres`,
					"any.required": `Email es requerido`,
				}),
				password: Joi.string().min(3).max(200).required().messages({
					"string.base": `Password debe ser de tipo texto`,
					"string.empty": `Password no puede estar vacío`,
					"string.min": `Password debe ser mayor a {#limit} caracteres`,
					"string.max": `Password debe ser menor a {#limit} caracteres`,
					"any.required": `Password es requerido`,
				}),
			});
			const { error } = schemaUsuarioLogin.validate(req.body);
			if (error) {
				return res.status(400).json({
					error: error.details[0].message,
				});
			}

			const { email, password } = req.body;

			const usuario = await Usuario.findOne({ where: { email } });
			if (!usuario) {
				return res.status(400).json({
					error: "Usuario no existe",
				});
			}
			const validPassword = bcrypt.compareSync(password, usuario.password);
			if (!validPassword) {
				return res.status(400).json({
					error: "Contraseña incorrecta",
				});
			}
			const token = jwt.sign(
				{
					id: usuario.id,
				},
				process.env.JWT_SECRET_KEY as string,
				{ expiresIn: "1h" }
			);
			return res.status(200).json({
				token,
			});
		} catch (error) {
			console.log(error);
			return res.status(500).json({
				error: "Error en el servidor",
			});
		}
	};
}

export default UsuarioController;
