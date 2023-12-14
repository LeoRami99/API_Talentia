interface ICurso {
	id: string;
	nombre: string;
	descripcion: string;
	precio: number;
	imagen_url: string;
	categoria: string;
	nivel: string;
	requisitos: string[];
	modulos_lecciones: IModulos_lecciones[];
	codigo_acceso: string;
	puntuacion_curso: number;
	id_administrador: string;
}

interface IModulos_lecciones {
	titulo_modulo: string;
	descripcion_modulo: string;
	lecciones: ILecciones[];
}
interface ILecciones {
	titulo_leccion: string;
	descripcion_leccion: string;
	contenido_url: string;
	tipo_contenido: string;
}

export { ICurso, IModulos_lecciones, ILecciones };
