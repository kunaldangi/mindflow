import { DataTypes } from 'sequelize';

export async function initializeMessagesModel(sequelize) {
    return sequelize.define('messages', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            unique: true,
            primaryKey: true
        },
        chatId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'chats',
                key: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        authorType: {
            type: DataTypes.ENUM('user', 'ai'),
            allowNull: false,
        },
        authorId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            onDelete: 'NO ACTION',
            onUpdate: 'CASCADE',
        },
        reasoning: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: "",
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: "",
        }
    });
}