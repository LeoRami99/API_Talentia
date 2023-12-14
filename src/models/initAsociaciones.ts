import { Administrador } from "./Administrador";
import { Curso } from "./Curso";

function applyAssociations() {
	// asociaciones de uno a muchos (1:N) donde 1 es el administrador y N son los cursos
	Administrador.hasMany(Curso);
	Curso.belongsTo(Administrador);
}

export { applyAssociations };
