const { DataTypes } = require("sequelize");
const { sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {

    const User = sequelize.define('User', {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        lastLogin: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        dob: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        role: {
            type: ENUM('Admin', 'Normal'),
            allowNull: false,
            defaultValue: 'Normal'
        },
        phone: {
            type: DataTypes.CHAR(11),
            allowNull: true
        }
    }, {
        timestamps: true
    });

    return User;
}
