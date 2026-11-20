import {NextResponse} from "next/server";
import {publishDueBlogs} from "@/lib/blog.server";
export const runtime="nodejs";export const dynamic="force-dynamic";
export const maxDuration=60;
export async function GET(request:Request){
 if(!process.env.CRON_SECRET||request.headers.get("authorization")!==`Bearer ${process.env.CRON_SECRET}`)return NextResponse.json({message:"Unauthorized"},{status:401});
 for(let attempt=0;attempt<3;attempt++){try{return NextResponse.json({published:await publishDueBlogs(),checkedAt:new Date().toISOString()});}catch(error){console.error("Blog scheduler attempt failed",attempt+1,error);}}
 return NextResponse.json({message:"Publication failed"},{status:503});
}
