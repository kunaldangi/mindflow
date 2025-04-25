import { config } from 'dotenv'; config();
import { Sequelize } from "sequelize";

import { initializeUsersModel } from '../models/Users.js';
import { initializeOtpsModel } from '../models/Otps.js';
import { initializeModelsModel } from '../models/Models.js';
import { initializeChatsModel } from '../models/Chats.js';
import { initializeMessagesModel } from '../models/Messages.js';

const sequelize = new Sequelize(`postgres://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    {
        dialect: 'postgres',
        define: {
            freezeTableName: true,
        }
    }
);

let Users = null;
let Otps = null;
let Models = null;
let Chats = null;
let Messages = null;

export async function connectDb(){
    try {
        await sequelize.authenticate();
        console.log('Connection to the database has been established successfully.');

        Users = await initializeUsersModel(sequelize);
        Otps = await initializeOtpsModel(sequelize);
        Models = await initializeModelsModel(sequelize);
        Chats = await initializeChatsModel(sequelize);
        Messages = await initializeMessagesModel(sequelize);

        await sequelize.sync({alter: true});
    } catch (error) {
        console.log('Unable to connect to the database:', error);
    }
}

export default sequelize;
export { Users, Otps, Models, Chats, Messages };