import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
        return new NextResponse(`OAuth error: ${error}`, { status: 400 });
    }

    if (!code) {
        return new NextResponse('Missing code', { status: 400 });
    }

    const clientId = process.env.DATASITE_CLIENT_ID;
    const clientSecret = process.env.DATASITE_CLIENT_SECRET;
    const redirectUri = `${req.nextUrl.origin}/api/oauth/callback`;

    try {
        const tokenRes = await axios.post('https://auth.dev.datasite.com/as/token.oauth2',
            {
                grant_type: 'authorization_code',
                code,
                redirect_uri: redirectUri,
                client_id: clientId,
                client_secret: clientSecret,
            },
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

        const { access_token } = tokenRes.data as { access_token: string; };
        const response = NextResponse.redirect(new URL('/', req.nextUrl));
        response.cookies.set('datasite_token', access_token, {
            path: '/',
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
        });
        return response;
    } catch (err) {
        return new NextResponse('OAuth error', { status: 500 });
    }
}
