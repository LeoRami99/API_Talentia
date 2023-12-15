interface IPregunta {
	orden: number;
	pregunta: string;
	opciones: IOpciones[];
}
interface IOpciones {
	orden: number;
	opcion: string;
	correcta: boolean;
}
export { IPregunta, IOpciones };
