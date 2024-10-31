import { Sequelize, DataTypes } from 'sequelize';
import {db} from "../config/database.js" 
import bcrypt from 'bcrypt';
import logger from '../services/logger.js';
import Image from './image.js'

const User = db.define('User', {
  id:{
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  account_created: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
    allowNull: false
  },
  account_updated: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
    allowNull: false
  }
}, {
  // Ensure timestamps are enabled and map to custom column names
  timestamps: true,
  createdAt: 'account_created',
  updatedAt: 'account_updated',
  hooks: {
    beforeCreate: async (user) => {
      const salt = 10;
      const hashedPassword = await bcrypt.hash(user.password, salt);
      user.password = hashedPassword;
    },
    beforeUpdate: async (user) => {
      const salt = 10;
      const hashedPassword = await bcrypt.hash(user.password, salt);
      user.password = hashedPassword;
    },
  }
});

// Define associations
User.hasOne(Image, {
  foreignKey: 'userId',
  as: 'image' // This is the alias for the association
});

// User.sync()
// .then(() => {
//   console.log('User table created successfully.');
//   logger.info("User table created successfully.");
// })
// .catch((error) => {
//   console.error('Error creating User table:', error);
//   logger.error("Error creating User table:",error);
// });

export default User;
