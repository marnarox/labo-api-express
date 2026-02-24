import { DataTypes } from "sequelize";
import sequelize from "../config.js";

const User = sequelize.define(
    "User",
    {
        id:{
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        email:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        nickname:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        gender:{
            type: DataTypes.ENUM('homme', 'femme','autre'),
            allowNull: false,
        },
        birthDate:{
            type: DataTypes.DATE,
            allowNull: false,
        },
        elo:{
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1200,
        },
        role:{
            type: DataTypes.ENUM('admin', 'member'),
            defaultValue: 'member'
        },
    },
    {
        tableName: "users",
    },
);

export default User;