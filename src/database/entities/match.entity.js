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

        currentRound:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        result:{
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: "matches",
    },
);

export default Match;