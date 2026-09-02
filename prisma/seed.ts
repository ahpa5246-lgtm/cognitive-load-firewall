import { PrismaClient } from "@prisma/client";
const prisma=new PrismaClient();
async function main(){const users=await Promise.all([["maya.demo@example.com","Maya"],["alex.demo@example.com","Alex"],["jordan.demo@example.com","Jordan"]].map(([email,displayName])=>prisma.user.upsert({where:{email},update:{},create:{email,displayName}})));const profiles=[[42,50,46,44,25,38],[56,58,34,62,50,44],[78,74,72,76,70,72]];for(let i=0;i<users.length;i++){const [reading,memory,attention,visual,motion,density]=profiles[i];await prisma.cognitiveProfile.create({data:{userId:users[i].id,source:"demo",reading,memory,attention,visual,motion,density}})}}
main().finally(()=>prisma.$disconnect());
