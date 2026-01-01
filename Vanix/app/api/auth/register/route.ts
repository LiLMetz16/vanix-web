import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server"; // adjust import to your project

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // ✅ IMPORTANT: await the client
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // optional: email redirect after confirm
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
