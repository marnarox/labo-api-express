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
		location: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: "En ligne",
		},
		playerMin: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 2
		},
		playerMax: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 32
		},
		eloMin: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 0
		},
		eloMax: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 3000,
		},
        currentRound: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
		isWoman: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		status: {
			type: DataTypes.ENUM('en attente de joueurs', 'en attente', 'en cours', 'terminé'),
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
