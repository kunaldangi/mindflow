import { config } from 'dotenv'; config();
import express from 'express';

import { nextApp } from './config/next.js';
import { initializeRoutes } from './api/index.js';

const port = 3000;
const dev = process.env.NODE_ENV !== 'production';

const app = express();

async function main(){
    app.use(express.json()); // middleware to parse JSON request body

    initializeRoutes(app); // initializing API routes
    
    const nextHandler = await nextApp(dev); // initializing Next.js
    app.use(nextHandler); // adding Next.js to Express
    
    app.listen(port, () => {
        console.log(`Mindflow is running on PORT: ${port}`);
    });
}

main();