import { Usuario, schemaUsuario } from "../models/Usuario";
import { Curso } from "../models/Curso";
import { ProgresoUsuario, schemaProgresoUsuario } from "../models/ProgresoUsuario";
import { Request, Response } from "express";
import { generateToken, verifyToken, verifyTokenResetPassword, generateTokenResetPassword } from "../utils/tokenUtils";
import sendMail from "../utils/sendMail";
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
					role: "usuario",
				},
				process.env.JWT_SECRET_KEY as string,
				{ expiresIn: "7d" }
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
	sendEmailToVerify = async (req: Request, res: Response) => {
		try {
			let is_active_account = false;
			const emailExist = await Usuario.findOne({
				where: { email: req.body.email },
			});
			if (emailExist) {
				if (emailExist.email_verified) {
					is_active_account = true;
					return res.status(400).json({ message: "Email already verified" });
				} else {
					is_active_account = false;
					const url_endpoint = process.env.ENDPOINT as string;
					const token = generateToken(req.body.email, is_active_account) as string;
					const html_mail = `
					<p>¡Recuerda que tienes 1 hora para verificar tu correo electrónico!</p>
					<p>Para verificar tu correo electrónico, haz clic en el siguiente enlace:</p>
				<a href="${url_endpoint}/usuario/verify-email/${token}">${url_endpoint}/usuario/verify-email/${token}</a>`;
					sendMail(req.body.email, "Verifica tu cuenta", html_mail);
					res.status(200).json({ message: "Email sent successfully" });
				}
			} else {
				return res.status(400).json({ message: "Email not exists" });
			}
		} catch (error) {
			res.status(500).json({ message: "Server Error" });
		}
	};
	verifyEmail = async (req: Request, res: Response) => {
		try {
			const token = req.params.token as string;
			const verify = verifyToken(token);
			if (verify.isValid) {
				const candidate = await Usuario.findOne({
					where: { email: verify.email },
				});
				if (candidate) {
					await Usuario.update({ email_verified: true }, { where: { email: verify.email } });
					res.status(200).header("Content-Type", "text/html").send(`<meta http-equiv="refresh" content="2; URL=${process.env.FRONTEND_ENDPOINT}" /><h1>¡Tu correo electrónico ha sido verificado!</h1>`);
				} else {
					res.status(404).json({ message: "Usuario no existe" });
				}
			} else {
				res.status(400).json({ message: verify.message });
			}
		} catch (error) {
			res.status(500).json({ message: "Server Error" });
		}
	};
	sendEmailToResetPassword = async (req: Request, res: Response) => {
		try {
			const emailExist = await Usuario.findOne({
				where: { email: req.body.email },
			});
			if (emailExist) {
				const url_endpoint = (process.env.FRONTEND_ENDPOINT as string) || "http://localhost:4000";
				const token = generateTokenResetPassword(emailExist.id) as string;
				const html_mail = `
				<p>¡Recuerda que tienes 1 hora para cambiar tu contraseña!</p>
				<p>Para cambiar tu contraseña, haz clic en el siguiente enlace:</p>
			<a href="${url_endpoint}/reset-password?token=${token}">${url_endpoint}/reset-password?token=${token}</a>`;
				sendMail(req.body.email, "Cambia tu contraseña", html_mail);
				res.status(200).json({ message: "Correo enviado" });
			} else {
				return res.status(400).json({ message: "El correo no existe" });
			}
		} catch (error) {
			res.status(500).json({ message: "Server Error" });
		}
	};
	resetPassword = async (req: Request, res: Response) => {
		try {
			const token = req.params.token as string;
			const verify = verifyTokenResetPassword(token);
			if (verify.isValid) {
				const usuario = await Usuario.findOne({
					where: { id: verify.id },
				});
				if (usuario) {
					const { password } = req.body;
					const salt = bcrypt.genSaltSync(10);
					const hash = bcrypt.hashSync(password, salt);
					await Usuario.update({ password: hash }, { where: { id: verify.id } });
					res.status(200).header("Content-Type", "text/html").send(`<meta http-equiv="refresh" content="2; URL=${process.env.FRONTEND_ENDPOINT}" /><h1>¡Tu contraseña ha sido cambiada!</h1>`);
				} else {
					res.status(404).json({ message: "Usuario no existe" });
				}
			} else {
				res.status(400).json({ message: verify.message });
			}
		} catch (error) {
			res.status(500).json({ message: "Server Error" });
		}
	};
	verifyAndupdatePasswordFromReset = async (req: Request, res: Response) => {
		try {
			const token = req.body.token as string;
			const id_usuario = req.body.id as string;
			const verify = verifyTokenResetPassword(token);
			if (id_usuario !== verify.id) {
				return res.status(400).json({ message: "Credentials not valid" });
			} else {
				if (verify.isValid) {
					const recruiter = await Usuario.findOne({
						where: { id: id_usuario },
					});
					if (recruiter) {
						const passwordSchema = Joi.string().pattern(new RegExp("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$")).min(8).max(128).required().messages({
							"string.min": "La contraseña debe tener al menos 8 caracteres.",
							"string.max": "La contraseña no puede tener más de 128 caracteres.",
							"string.pattern.base": "La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial.",
							"any.required": "El campo de contraseña es obligatorio.",
						});

						// Validar el password
						const { error } = passwordSchema.validate(req.body.password);
						if (error) {
							return res.status(400).json({ message: error.details[0].message });
						}
						await Usuario.update({ password: bcrypt.hashSync(req.body.password, 10) }, { where: { id: id_usuario } });
						res.status(200).json({ message: "Password updated successfully" });
					} else {
						res.status(404).json({ message: "Recruiter not found" });
					}
				} else {
					res.status(400).json({ message: verify.message });
				}
			}
		} catch (error) {
			res.status(500).json({ message: "Server Error" });
		}
	};
	// trear los cursos donde el usuario esta inscrito
	getCursosUsuario = async (req: Request, res: Response) => {
		try {
			const { id_usuario } = req.params;
			const cursos = await Curso.findAll({
				include: [
					{
						model: Usuario,
						attributes: [],
						where: { id: id_usuario },
						through: { attributes: [] },
					},
				],
				attributes: {
					exclude: ["modulos_lecciones", "AdministradorId"],
				},
			});

			return res.status(200).json({
				cursos,
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
