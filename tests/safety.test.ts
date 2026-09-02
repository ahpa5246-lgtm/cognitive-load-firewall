import {describe,expect,it} from "vitest";import {safetyScan} from "@/lib/safety/rules";
describe("safety layer",()=>{it("blocks emergency-like input",()=>{expect(safetyScan("I have repeated vomiting and increasing confusion").blocked).toBe(true)});it("allows normal adaptation requests",()=>{expect(safetyScan("This article feels too dense to read").blocked).toBe(false)})});
