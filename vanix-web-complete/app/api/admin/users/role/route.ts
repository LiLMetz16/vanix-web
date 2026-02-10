import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

async function requireAdmin(req: Request) {
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return { ok: false as const, status: 401, error: "Missing token" };

  const { data: userData, error: userErr } = await supabaseServer.auth.getUser(token);
  if (userErr || !userData.user) return { ok: false as const, status: 401, error: "Invalid token" };

  const userId = userData.user.id;

  const { data: urow, error: uerr } = await supabaseServer
    .from("users")
    .select("role")
    .eq("id", userId)
    .single();

  if (uerr || !urow || urow.role !== "admin") {
    return { ok: false as const, status: 403, error: "Forbidden" };
  }

  return { ok: true as const, token, userId };
}

export async function PATCH(req: Request) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });

  const body = await req.json().catch(() => null);
  const targetId = body?.id as string | undefined;
  const role = body?.role as "client" | "admin" | undefined;

  if (!targetId || (role !== "client" && role !== "admin")) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { error } = await supabaseServer.from("users").update({ role }).eq("id", targetId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
