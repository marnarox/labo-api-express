import { DataTypes } from "sequelize";
import sequelize from "../config.js";

const Match = sequelize.define(
    "Match",
    {
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        roundNumber:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        result:{
            type: DataTypes.ENUM('Pas encore joué', 'Blanc', 'Noir', "Égalité"),
            allowNull: false,
            defaultValue: "Pas encore joué"
        },
    },
    {
        tableName: "matches",
    },
);

export default Match;