// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const { email, password, username } = (await req.json()) as {
      email: string;
      password: string;
      username: string;
    };

    if (!email || !password || !username) {
      return NextResponse.json({ error: "Missing email, password or username" }, { status: 400 });
    }

    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username, // also stored in user_metadata
          role: "user",
        },
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const userId = data.user?.id;
    if (userId) {
      // Create/Upsert profile row (recommended source of truth)
      const { error: profErr } = await supabase.from("profiles").upsert(
        {
          id: userId,
          username,
          role: "user",
        },
        { onConflict: "id" }
      );

      if (profErr) {
        // Auth created but profile insert failed
        return NextResponse.json(
          { ok: true, userId, warning: "Registered, but profile creation failed", detail: profErr.message },
          { status: 200 }
        );
      }
    }

    return NextResponse.json({ ok: true, userId: userId ?? null }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
