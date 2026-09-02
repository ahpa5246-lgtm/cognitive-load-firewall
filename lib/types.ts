export type LoadVector = { reading:number; memory:number; attention:number; visual:number; motion:number; density:number };
export type AdaptationStrategy = "CHUNK_CONTENT" | "REDUCE_INFORMATION_DENSITY" | "ADD_MEMORY_SUPPORT" | "REDUCE_MOTION" | "GUIDED_STEPS";
export type AdaptationPlan = { strategies: { type: AdaptationStrategy; reason:string; priority:number }[] };
