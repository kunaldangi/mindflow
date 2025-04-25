import { DataTypes } from 'sequelize';

export async function initializeModelsModel(sequelize) {
    return sequelize.define('models', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            unique: true,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
        },
    });
}