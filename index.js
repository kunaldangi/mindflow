import dotenv from 'dotenv'; dotenv.config(); // load env variables
import express from 'express';
import cookieParser from 'cookie-parser';

import { connectDb } from './src/config/db.js';
import { nextApp } from './src/config/next.js';
import { initializeRoutes } from './src/api/index.js';

const port = process.env.PORT || 3000; 
const dev = process.env.BACKEND_ENV !== 'production';

const app = express();

async function main(){
    await connectDb(); // connecting to the database

    app.use(express.json()); // middleware to parse JSON request body
    app.use(cookieParser()); // middleware to parse cookies

    initializeRoutes(app); // initializing API routes
    
    const nextHandler = await nextApp(dev); // initializing Next.js
    app.use(nextHandler); // adding Next.js to Express
    
    app.listen(port, () => {
        console.log(`Mindflow is running on PORT: ${port}`);
    });
}

main();