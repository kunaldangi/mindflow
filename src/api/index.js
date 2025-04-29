import checkSession from '../middleware/session.js';

import authRouter from './auth/index.js';
import userRouter from './user/index.js';
import chatRouter from './chat/index.js';
import aiRouter from './ai/index.js';

async function initializeRoutes(app){
    app.use('/api/auth', authRouter); // no need to check session for auth routes

    app.use(checkSession);
    app.use('/api/user', userRouter);
    app.use('/api/chat', chatRouter);
    app.use('/api/ai', aiRouter)
}

export { initializeRoutes };