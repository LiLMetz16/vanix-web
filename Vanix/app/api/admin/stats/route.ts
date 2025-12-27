import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) return NextResponse.json({ error: "Missing token" }, { status: 401 });

  const { data: userData, error: userErr } = await supabaseServer.auth.getUser(token);
  if (userErr || !userData.user) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const userId = userData.user.id;

  const { data: urow, error: uerr } = await supabaseServer
    .from("users")
    .select("role")
    .eq("id", userId)
    .single();

  if (uerr || !urow) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (urow.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { count: usersCount } = await supabaseServer
    .from("users")
    .select("*", { count: "exact", head: true });

  let ordersCount = 0;
  const ordersRes = await supabaseServer.from("orders").select("*", { count: "exact", head: true });
  if (!ordersRes.error) ordersCount = ordersRes.count ?? 0;

  return NextResponse.json({
    users: usersCount ?? 0,
    orders: ordersCount,
    updatedAt: new Date().toISOString(),
  });
}
