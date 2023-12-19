import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config";

class CursoExamen extends Model {
	public id!: string;
	public cursoId!: string;
	public examenId!: string;
}

CursoExamen.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
			allowNull: false,
			unique: true,
		},
		cursoId: {
			type: DataTypes.UUID,
			allowNull: false,
		},
		examenId: {
			type: DataTypes.UUID,
			allowNull: false,
		},
	},
	{
		tableName: "CursoExamen",
		sequelize: sequelize,
	}
);

export { CursoExamen };
