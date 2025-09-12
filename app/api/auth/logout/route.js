import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set("token", "", { maxAge: 0, path: "/" }); // clear token
  return res;
}
