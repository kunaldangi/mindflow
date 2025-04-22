import express from 'express';

import { nextApp } from './next.js';
import { initializeRoutes } from './api/index.js';

const port = 3000;
const dev = process.env.NODE_ENV !== 'production';

const app = express();

initializeRoutes(app); // initializing API routes

const nextHandler = await nextApp(dev); // initializing Next.js
app.use(nextHandler); // adding Next.js to Express

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})