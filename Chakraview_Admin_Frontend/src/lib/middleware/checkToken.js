import { jwtDecode } from 'jwt-decode';
import { NextResponse } from 'next/server';

export function checkTokenMiddleware(request) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('token');

    const publicRoutes = [
        '/login',
        '/register',
        '/login/username-password'
    ];

    if (publicRoutes.includes(pathname)) {
        if (token) {
            const tokenDecoded = jwtDecode(token.value)
            const roles = tokenDecoded.roles.map((data) => data.slug) || []
            if (roles.includes("admin")) {
                return NextResponse.redirect(new URL('/admin', request.url))
            } else {
                return NextResponse.redirect(new URL('/user', request.url))
            }
        }
        return NextResponse.next();
    }

    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}
