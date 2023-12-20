import { Model, DataTypes } from "sequelize";
import { Usuario } from "./Usuario";
import { Examen } from "./Examen";

import { sequelize } from "../config";

class ProgresoExamen extends Model {
	public id!: string;
	public UsuarioId!: string;
	public ExamenId!: string;
	public numIntentos!: number;
	public puntuacionObtenida!: number;
	public dataExamen!: string;
	public completado!: boolean;
}
ProgresoExamen.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		UsuarioId: {
			type: DataTypes.UUID,
			references: {
				model: Usuario,
				key: "id",
			},
		},
		ExamenId: {
			type: DataTypes.UUID,
			references: {
				model: Examen,
				key: "id",
			},
		},
		numIntentos: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		dataExamen: DataTypes.JSON(),

		completado: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
	},
	{
		sequelize,
		tableName: "ProgresoExamen",
	}
);

export { ProgresoExamen };
