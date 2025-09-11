import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('datasite_token');
    const isAuthenticated = !!token;

    // If not authenticated, redirect to Datasite OAuth
    if (!isAuthenticated && !request.nextUrl.pathname.startsWith('/api/oauth/callback')) {
        const clientId = process.env.DATASITE_CLIENT_ID;
        const redirectUri = `${request.nextUrl.origin}/api/oauth/callback`;
        const authUrl = `https://auth.dev.datasite.com/as/authorization.oauth2?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`;
        return NextResponse.redirect(authUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/'], // Apply to all routes
};
