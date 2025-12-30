import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

function getIdFromJwt(token: string): string | null {
    try {
        const decoded: any = jwtDecode(token);
        console.log('decoded', decoded);
        return decoded.sub || null;
    } catch {
        return null;
    }
}

export function proxy(request: NextRequest) {

    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    const token = request.cookies.get('datasite_token');

    if (id) {
        const isAuthenticated = !!token && id === getIdFromJwt(token?.value || '');
        // If not authenticated, redirect to Datasite OAuth
        if (!isAuthenticated && !request.nextUrl.pathname.startsWith('/api/oauth/callback')) {
            const clientId = process.env.DATASITE_CLIENT_ID;
            const redirectUri = `${request.nextUrl.origin}/api/oauth/callback`;
            const authUrl = `https://auth.dev.datasite.com/as/authorization.oauth2?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`;
            return NextResponse.redirect(authUrl);
        }
    }
    return NextResponse.next();
}

export const config = {
    matcher: ['/'], // Apply to all routes
};
