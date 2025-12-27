import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  try {
    // В този демо вариант четем email от cookie.
    // В production това трябва да е session/JWT (Supabase Auth).
    const cookie = req.headers.get("cookie") || "";
    const match = cookie.match(/vanix_email=([^;]+)/);
    const email = match ? decodeURIComponent(match[1]) : null;

    if (!email) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const { data, error } = await supabase
      .from("users")
      .select("id, username, email, role")
      .eq("email", email)
      .single();

    if (error) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json(
      {
        user: {
          id: data.id,
          name: data.username,
          email: data.email,
          role: data.role,
        },
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
