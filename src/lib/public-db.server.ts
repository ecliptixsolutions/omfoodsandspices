import "server-only";
import {unstable_cache, revalidateTag} from "next/cache";
import {getAdminDb, type DbRow} from "./admin/db.server";

// Only published, non-personal content belongs here. Failed reads are not cached.
let limitedUntil=0;
const read = unstable_cache(async (sql:string, values:string[]) => {
  if(Date.now()<limitedUntil) throw Object.assign(new Error("Content database temporarily rate limited"), {code:"ER_USER_LIMIT_REACHED"});
  try {
    const [rows] = await getAdminDb().query<DbRow[]>(sql, values);
    return rows;
  } catch(error) {
    if((error as {code?:string}).code==="ER_USER_LIMIT_REACHED") limitedUntil=Date.now()+60000;
    throw error;
  }
}, ["om-public-sql-v1"], {revalidate:300, tags:["om-public"]});

export function publicRows(sql:string, values:string[] = []) { return read(sql, values); }
export function invalidatePublicContent() { revalidateTag("om-public"); }
