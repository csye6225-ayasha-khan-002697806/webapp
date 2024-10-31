// models/Image.js
import { Sequelize, DataTypes } from 'sequelize';
import {db} from "../config/database.js"  
import logger from '../services/logger.js';

const Image = db.define('Image', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
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
        allowNull: true, // Allow null since a user can have no image
        references: {
            model: 'Users', // The name of the User model in the database
            key: 'id'
        }
    }
}, {
    timestamps: false,
    tableName: 'images'
});


// Image.sync()
// .then(() => {
//   console.log('Image table created successfully.');
//   logger.info("Image table created successfully.");
// })
// .catch((error) => {
//   console.error('Error creating Image table:', error);
//   logger.error("Error creating Image table:",error);
// });


export default Image;
