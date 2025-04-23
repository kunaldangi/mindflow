import { DataTypes } from 'sequelize';

export async function initializeOtpsModel(sequelize) {
    return sequelize.define('otps', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            unique: true,
            primaryKey: true
        },
        type: { // 1 - signup, 2 - forgot password
            type: DataTypes.INTEGER,
            allowNull: false
        },
        email: { // email of the user
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        code: { // otp code
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });
}