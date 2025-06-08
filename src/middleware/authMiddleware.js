import { NextResponse } from 'next/server';

export function authMiddleware(request) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return null;
}
