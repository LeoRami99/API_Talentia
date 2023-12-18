import dotenv from "dotenv";

const env = dotenv.config();
import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
	// tus configuraciones de conexión a la base de datos aquí
	dialect: "mysql",
	host: "localhost",
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	// username: "root",
	// password: "",
	// database: "diagnostico",
});

const configMail = {
	host: "mail.cymetria.com",
	port: 465,
	secure: true,
	auth: {
		user: process.env.MAIL_USER,
		pass: process.env.MAIL_PASSWORD,
	},
};

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

export { sequelize, configMail };
export { JWT_SECRET_KEY };
