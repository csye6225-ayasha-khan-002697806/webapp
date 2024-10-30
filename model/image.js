// models/Image.js
import { Sequelize, DataTypes } from 'sequelize';
import {db} from "../config/database.js"  // Assuming sequelize instance is set up here

const Image = db.define('Image', {
    id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    fileName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    uploadDate: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
    }
}, {
    timestamps: false,
    tableName: 'images'
});

module.exports = Image;
