import { config } from 'dotenv'; config();
import fs from 'fs';
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

// const caCert = fs.readFileSync(`${process.env.SSL_CERT}`).toString();

/* const sequelize = new Sequelize(
    `${process.env.DB_NAME}`,
    `${process.env.DB_USER}`,
    `${process.env.DB_PASS}`,
    {
        host: `${process.env.DB_HOST}`,
        port: Number(`${process.env.DB_PORT}` || 5432),
        dialect: 'postgres',
        define: {
            freezeTableName: true,
        },
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: true,
                ca: caCert,
            }
        }
    }
); */


let Users = null;
let Otps = null;
let Models = null;
let Chats = null;
let Messages = null;

export async function connectDb() {
    try {
        await sequelize.authenticate();
        console.log('Connection to the database has been established successfully.');

        Users = await initializeUsersModel(sequelize);
        Otps = await initializeOtpsModel(sequelize);
        Models = await initializeModelsModel(sequelize);
        Chats = await initializeChatsModel(sequelize);
        Messages = await initializeMessagesModel(sequelize);

        await sequelize.sync({ alter: true });

        let deleteModels = await Models.destroy({ where: {}, truncate: true, restartIdentity: true });

        if (!deleteModels) console.log("Unable to delete models table!");
        else console.log("Models table deleted successfully!");

        let insertModels = await Models.bulkCreate([
            { title: "thudm/glm-z1-9b:free" },
            { title: "thudm/glm-4-9b:free" },
            { title: "microsoft/mai-ds-r1:free" },
            { title: "thudm/glm-z1-32b:free" },
            { title: "thudm/glm-4-32b:free" },
            { title: "shisa-ai/shisa-v2-llama3.3-70b:free" },
            { title: "arliai/qwq-32b-arliai-rpr-v1:free" },
            { title: "agentica-org/deepcoder-14b-preview:free" },
            { title: "moonshotai/kimi-vl-a3b-thinking:free" },
            { title: "nvidia/llama-3.1-nemotron-nano-8b-v1:free" },
            { title: "nvidia/llama-3.3-nemotron-super-49b-v1:free" },
            { title: "nvidia/llama-3.1-nemotron-ultra-253b-v1:free" },
            { title: "meta-llama/llama-4-maverick:free" },
            { title: "meta-llama/llama-4-scout:free" },
            { title: "deepseek/deepseek-v3-base:free" },
            { title: "allenai/molmo-7b-d:free" },
            { title: "bytedance-research/ui-tars-72b:free" },
            { title: "qwen/qwen2.5-vl-3b-instruct:free" },
            { title: "google/gemini-2.5-pro-exp-03-25" },
            { title: "qwen/qwen2.5-vl-32b-instruct:free" },
            { title: "deepseek/deepseek-chat-v3-0324:free" },
            { title: "featherless/qwerky-72b:free" },
            { title: "mistralai/mistral-small-3.1-24b-instruct:free" },
            { title: "open-r1/olympiccoder-32b:free" },
            { title: "google/gemma-3-1b-it:free" },
            { title: "google/gemma-3-4b-it:free" },
            { title: "google/gemma-3-12b-it:free" },
            { title: "rekaai/reka-flash-3:free" },
            { title: "google/gemma-3-27b-it:free" },
            { title: "deepseek/deepseek-r1-zero:free" },
            { title: "qwen/qwq-32b:free" },
            { title: "moonshotai/moonlight-16b-a3b-instruct:free" },
            { title: "nousresearch/deephermes-3-llama-3-8b-preview:free" },
            { title: "cognitivecomputations/dolphin3.0-r1-mistral-24b:free" },
            { title: "cognitivecomputations/dolphin3.0-mistral-24b:free" },
            { title: "qwen/qwen2.5-vl-72b-instruct:free" },
            { title: "mistralai/mistral-small-24b-instruct-2501:free" },
            { title: "deepseek/deepseek-r1-distill-qwen-32b:free" },
            { title: "deepseek/deepseek-r1-distill-qwen-14b:free" },
            { title: "deepseek/deepseek-r1-distill-llama-70b:free" },
            { title: "deepseek/deepseek-r1:free" },
            { title: "sophosympatheia/rogue-rose-103b-v0.2:free" },
            { title: "deepseek/deepseek-chat:free" },
            { title: "google/gemini-2.0-flash-exp:free" },
            { title: "meta-llama/llama-3.3-70b-instruct:free" },
            { title: "qwen/qwq-32b-preview:free" },
            { title: "google/learnlm-1.5-pro-experimental:free" },
            { title: "qwen/qwen-2.5-coder-32b-instruct:free" },
            { title: "qwen/qwen-2.5-7b-instruct:free" },
            { title: "meta-llama/llama-3.2-3b-instruct:free" },
            { title: "meta-llama/llama-3.2-1b-instruct:free" },
            { title: "meta-llama/llama-3.2-11b-vision-instruct:free" },
            { title: "qwen/qwen-2.5-72b-instruct:free" },
            { title: "qwen/qwen-2.5-vl-7b-instruct:free" },
            { title: "google/gemini-flash-1.5-8b-exp" },
            { title: "meta-llama/llama-3.1-405b:free" },
            { title: "meta-llama/llama-3.1-8b-instruct:free" },
            { title: "google/gemma-2-9b-it:free" },
            { title: "mistralai/mistral-7b-instruct:free" },
            { title: "huggingfaceh4/zephyr-7b-beta:free" },
            { title: "mistralai/mistral-nemo:free" }
        ]);

    } catch (error) {
        console.log('Unable to connect to the database:', error);
    }
}

export default sequelize;
export { Users, Otps, Models, Chats, Messages };
