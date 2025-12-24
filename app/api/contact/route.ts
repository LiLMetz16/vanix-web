import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    console.log("https://evsmolznhwevxxwadnmq.supabase.co/rest/v1/rpc/messages" );
    console.log("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2c21vbHpuaHdldnh4d2Fkbm1xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDQyMTc2OCwiZXhwIjoyMDc5OTk3NzY4fQ.KPAxQDJTEa7LEPiYX260R2NfZgal-ZAUuVrj2W2rmfE", process.env.SUPABASE_SERVICE_ROLE_KEY);


  if (!url || !serviceKey) {
    return NextResponse.json(
      { error: "Missing Supabase env vars" },
      { status: 500 }
    );
  }

  const supabase = createClient(url, serviceKey);

  const { name, email, message } = await req.json();

  const { error } = await supabase.from("messages").insert([{ name, email, message }]);

  if (error) {
    return NextResponse.json(
      { error: `Supabase error: ${error.message}` },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}

