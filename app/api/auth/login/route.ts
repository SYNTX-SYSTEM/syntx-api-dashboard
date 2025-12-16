import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { username, password } = await request.json();
  
  const validUser = process.env.AUTH_USER || 'syntx';
  const validPass = process.env.AUTH_PASS || 'resonance2025';
  
  if (username === validUser && password === validPass) {
    const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');
    
    const response = NextResponse.json({ success: true });
    response.cookies.set('syntx-auth', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    
    return response;
  }
  
  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}
