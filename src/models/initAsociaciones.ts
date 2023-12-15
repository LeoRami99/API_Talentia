import { Administrador } from "./Administrador";
import { Curso } from "./Curso";
import { Usuario } from "./Usuario";
import { ProgresoUsuario } from "./ProgresoUsuario";
import { Examen } from "./Examen";
function applyAssociations() {
	// asociaciones de uno a muchos (1:N) donde 1 es el administrador y N son los cursos
	Administrador.hasMany(Curso);
	Curso.belongsTo(Administrador);
	//asocioanes de muchos a muchos (N:M) donde N son los cursos y M son los usuarios
	Usuario.belongsToMany(Curso, { through: ProgresoUsuario });
	Curso.belongsToMany(Usuario, { through: ProgresoUsuario });
	// asociaoines de uno a muchos (1:N) donde 1 es el administrador y N son los examenes
	Administrador.hasMany(Examen);
	Examen.belongsTo(Administrador);
}

export { applyAssociations };
