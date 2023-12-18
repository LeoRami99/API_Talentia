import express from "express";
import cors from "cors";
import { sequelize } from "./config";
import { applyAssociations } from "./models/initAsociaciones";
import usuarioRoutes from "./routes/usuarioRoutes";
import administradorRoutes from "./routes/administradorRoutes";
import cursoRoutes from "./routes/cursoRoutes";
import examenRoutes from "./routes/examenRoutes";
import utilsRouter from "./routes/utilsRouter";

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
app.use(`${API_VERSION}/examen`, examenRoutes);
app.use(`${API_VERSION}/utils`, utilsRouter);

// Static files
app.use(`${API_VERSION}/public`, express.static("src/uploads"));

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
