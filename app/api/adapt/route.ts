import { NextResponse } from "next/server";
import { adaptationInputSchema } from "@/lib/adaptation/pipeline";
import { adaptContentWorkflow } from "@/lib/workflow/local";

export async function POST(request: Request) {
  try {
    const parsed = adaptationInputSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "validation_error", message: "Please provide valid content and profile values." }, { status: 400 });
    const output = await adaptContentWorkflow(parsed.data);
    return NextResponse.json(output, { status: output.result.blocked ? 422 : 200 });
  } catch {
    return NextResponse.json({ error: "server_error", message: "The adaptation could not be completed. Please try again." }, { status: 500 });
  }
}