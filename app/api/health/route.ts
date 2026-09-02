import { NextResponse } from "next/server";
export async function GET(){return NextResponse.json({status:"ok",app:"cognitive-load-firewall",demoAiMode:process.env.DEMO_AI_MODE!=="false",databaseConfigured:Boolean(process.env.DATABASE_URL),timestamp:new Date().toISOString()});}
