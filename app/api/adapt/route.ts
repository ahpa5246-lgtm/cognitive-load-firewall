import { NextResponse } from "next/server";
import { adaptationInputSchema, runAdaptation } from "@/lib/adaptation/pipeline";

export async function POST(request: Request) {
  try {
    const input = adaptationInputSchema.parse(await request.json());
    return NextResponse.json(runAdaptation(input));
  } catch {
    return NextResponse.json({ error: "Please provide valid content and profile values." }, { status: 400 });
  }
}