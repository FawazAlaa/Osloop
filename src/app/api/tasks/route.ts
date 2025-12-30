// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> GET/POST  el call mn /api/tasks<<<<<<<<<<<<<<<<<<<<<<<<<<

import { NextResponse } from "next/server";
import { readDB, writeDB, nowISO, findUser, recomputeCounters } from "@/server/db";
import { getUserIdFromRequest } from "@/server/auth";
// El awl bas 3lshan negeeb el data 
export async function GET() {
  const userId = await getUserIdFromRequest();
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const db = await readDB();
  const user = findUser(db, userId);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  return NextResponse.json(user.tasks);
}
// w hna 3lshan add data mn el req body frontend 
export async function POST(req: Request) {
  const userId =await getUserIdFromRequest();
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const db = await readDB();
  const user = findUser(db, userId);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const now = nowISO();                          //3lshan close bas to machine w ana ba3etha locale shoia w shpoia iso 
                                                 //3lshan adman bas sa3at bab3t localestringw ba3den 3lshan
  const task = {                                 
    id: user.globalCounters.taskId++,            // 1)Standard across APIs, DBs, languages     
    title: body.title,                           //  2)la3'bata el locale  (12/10 vs 10/12)
    description: body.description ?? "",        
    priority: body.priority,                    
    status: body.status,                          
    createdAt: now,                             
    updatedAt: now
  };

  user.tasks.unshift(task);
  recomputeCounters(user);
  await writeDB(db);

  return NextResponse.json(task, { status: 201 });
}




