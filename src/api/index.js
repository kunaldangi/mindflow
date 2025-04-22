import authRouter from './auth/index.js';
// import dashboardRouter from './dashboard/index.js';

async function initializeRoutes(app){
    app.use('/api/auth', authRouter);
    // app.use('/api/dashboard', dashboardRouter);
}

export { initializeRoutes };