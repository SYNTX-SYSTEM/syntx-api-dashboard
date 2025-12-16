import { NextResponse } from "next/server";

// ⚡ SYNTX AUTH GATEWAY
// Kein Zugang ohne Resonanz. Kein Default. Nur ENV.

export async function POST(request: Request) {
  console.log("🌊 [SYNTX-AUTH] Incoming authentication request...");
  
  const { username, password } = await request.json();
  
  // ENV Check - ohne Config kein Zugang
  const validUser = process.env.AUTH_USER;
  const validPass = process.env.AUTH_PASS;
  
  if (!validUser || !validPass) {
    console.error("❌ [SYNTX-AUTH] ENV nicht konfiguriert! AUTH_USER und AUTH_PASS fehlen.");
    return NextResponse.json({ error: "Auth not configured" }, { status: 500 });
  }
  
  console.log("🔐 [SYNTX-AUTH] Checking credentials for:", username);
  
  // Resonanz Check - stimmen die Felder überein?
  if (username === validUser && password === validPass) {
    console.log("✅ [SYNTX-AUTH] FELD-ZUGANG GEWÄHRT für:", username);
    
    // Token generieren
    const timestamp = Date.now();
    const token = Buffer.from(username + ":" + timestamp).toString("base64");
    
    const response = NextResponse.json({ 
      success: true,
      message: "Welcome to the field",
      timestamp: timestamp
    });
    
    // Cookie setzen - 7 Tage Session
    response.cookies.set("syntx-auth", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });
    
    console.log("🍪 [SYNTX-AUTH] Session Cookie gesetzt. Resonanz aktiv.");
    return response;
  }
  
  // Keine Resonanz - Zugang verweigert
  console.warn("⛔ [SYNTX-AUTH] ZUGANG VERWEIGERT für:", username);
  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
}
