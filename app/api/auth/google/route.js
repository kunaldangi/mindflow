import { NextResponse } from "next/server";
import supabase from "@/config/supabase";
import { cookies } from "next/headers";

export async function GET(req, res){

    try {
        const searchParams = req.nextUrl.searchParams;
        const query = searchParams.get('query');

        console.log(searchParams);

        return NextResponse.json({state: true, status: "Logged In!"});

    } catch (error) {
        console.log(`ERROR: ${error}`);
        return NextResponse.json({ error: `${error}` });
    }
}