import Image from "next/image";
import { cookies } from "next/headers";
import { redirect } from 'next/navigation';
import verifyToken from "@/utils/verifyToken";

import VerifyOTP from "@/components/verifyOtp/VerifyOTP";

export default async function Home() {
    const cookieStore = cookies();
    const otp_token = cookieStore.get('otp_token');
    if (!otp_token){
        redirect('/signup');
    }
    try {
        await verifyToken(otp_token.value, process.env.JWT_OTP_SECRET);
    } catch (error) {
        console.log(`${error}`);
        redirect('/signup');
    }

    return (
        <div className="flex flex-col items-center">
            <header>
                <Image className="mt-8" src="/mindcaseLogoBlack.png" width="35" height="35" alt="image not found!" />
            </header>
            <main className="m-36 w-80">
                <VerifyOTP />
            </main>
        </div>
    );
}