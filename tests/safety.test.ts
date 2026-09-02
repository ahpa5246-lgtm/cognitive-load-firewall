import {describe,expect,it} from "vitest";import {safetyScan} from "@/lib/safety/rules";
import { defaultTolerance, runAdaptation } from "@/lib/adaptation/pipeline";
describe("safety layer",()=>{it("blocks emergency-like input",()=>{expect(safetyScan("I have repeated vomiting and increasing confusion").blocked).toBe(true)});it("allows normal adaptation requests",()=>{expect(safetyScan("This article feels too dense to read").blocked).toBe(false)});
	it("does not provide clearance for activity questions",()=>{const result=runAdaptation({content:"Can I return to football tomorrow after my concussion?",tolerance:defaultTolerance(),mode:"chunk"});expect(result.blocked).toBe(true);expect(result.safety.requiresCare).toBe(true);});
});
