import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../../config/index.js';

export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      role: {
        type: DataTypes.ENUM("admin", "user"),
        defaultValue: "user",
      },
      refreshToken: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      googleId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
      }
    },
    {
      tableName: "users",
      timestamps: true,
      hooks: {
        beforeSave: async (user) => {
          if (user.changed("password")) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        },
      },
    }
  );

  User.prototype.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  };

  User.prototype.generateAuthToken = async function () {
    const token = jwt.sign(
      {
        _id: this.id,
        email: this.email,
        role: this.role,
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    const refreshToken = jwt.sign(
      {
        _id: this.id,
        email: this.email,
        role: this.role,
      },
      config.jwt.refresh_secret,
      { expiresIn: '7d' }
    );
    
    this.refreshToken = refreshToken;
    await this.save();

    return { token, refreshToken };
  };

  return User;
};
