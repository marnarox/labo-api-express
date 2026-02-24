import { DataTypes } from 'sequelize';
import sequelize from '../config.js';

const Category = sequelize.define(
	'Category',
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},

		name: {
			type: DataTypes.ENUM('Junior', 'Senior', 'Veteran'),
			allowNull: false,
		},
	},
	{
		tableName: 'categories',
	},
);

export default Category;
