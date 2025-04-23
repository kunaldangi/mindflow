import { config } from 'dotenv'; config();
import { Sequelize } from "sequelize";

import { initializeUsersModel } from '../models/Users.js';
import { initializeOtpsModel } from '../models/Otps.js';

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

export async function connectDb(){
    try {
        await sequelize.authenticate();
        console.log('Connection to the database has been established successfully.');

        Users = await initializeUsersModel(sequelize);
        Otps = await initializeOtpsModel(sequelize);

        await sequelize.sync({alter: true});
    } catch (error) {
        console.log('Unable to connect to the database:', error);
    }
}

export default sequelize;
export { Users, Otps };