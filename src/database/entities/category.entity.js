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
		minAge: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
		},
		maxAge: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
	},
	{
		tableName: 'categories',
	},
);

export default Category;
