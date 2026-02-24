import { DataTypes } from 'sequelize';
import sequelize from '../config.js';

const Tournament = sequelize.define(
	'Tournament',
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		place: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		playerMin: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		playerMax: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		eloMin: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		eloMax: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
        roundNumber: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
		isWoman: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		status: {
			type: DataTypes.ENUM('en attente de joueurs', 'en cours', 'terminé'),
			defaultValue: 'en attente de joueurs',
			allowNull: false,
		},
		endInscriptionDate: {
			type: DataTypes.DATE,
			allowNull: false,
		},
	},
	{
		tableName: 'tournaments',
	},
);

export default Tournament;
