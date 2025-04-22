import { config } from 'dotenv'; config();
import { Sequelize } from "sequelize";

const sequelize = new Sequelize(`postgres://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/`);

export async function connectDb(){
    try {
        await sequelize.authenticate();
        console.log('Connection to the database has been established successfully.');
    } catch (error) {
        console.log('Unable to connect to the database:', error);
    }
}

export default sequelize;