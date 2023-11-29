import { NextResponse } from 'next/server';

import otp from './middlewares/api/auth/signup/otp';


export async function middleware(request) {

    if (request.nextUrl.pathname.startsWith('/api/auth/signup/verify') ||
        request.nextUrl.pathname.startsWith('/api/auth/signup/saveinfo')
    ){
        await otp(request);
    }

    // return NextResponse.redirect(new URL('/home', request.url))
}