import { NextResponse } from "next/server";

export default async function otp(request) {
    let otp_token = request.cookies.get('otp_token');
    if(!otp_token) return NextResponse.json({ error: "OTP token not found!" });
}