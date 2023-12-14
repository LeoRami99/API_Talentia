import express from "express";
import cors from "cors";
import { sequelize } from "./config";
import { applyAssociations } from "./models/initAsociaciones";
import usuarioRoutes from "./routes/usuarioRoutes";
import administradorRoutes from "./routes/administradorRoutes";
import cursoRoutes from "./routes/cursoRoutes";

//opciones para selectores
import categoriasRoutes from "./routes/categoriasRoute";

const API_VERSION = "/api/v1";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(`${API_VERSION}/usuario`, usuarioRoutes);
app.use(`${API_VERSION}/administrador`, administradorRoutes);
app.use(`${API_VERSION}/curso`, cursoRoutes);
app.use(`${API_VERSION}/categorias`, categoriasRoutes);

// Aqui se aplica la función de crear la asociación

applyAssociations();

sequelize
	.sync()
	.then(() => {
		console.log("Database connected");
	})
	.catch((err) => {
		console.log("Error connecting to database:", err);
	});

export default app;
