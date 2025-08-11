import { NextResponse } from 'next/server';

export function checkParentTokenMiddleware(request) {
    const { pathname } = request.nextUrl;
    const parentToken = request.cookies.get('parent-login-token');

    const parentPublicRoutes = [
        // '/fees-collection',
        '/fees-collection/student-login',
        '/fees-collection/student-signup'
    ];

    if (parentPublicRoutes.includes(pathname)) {
        if (parentToken) {
            return NextResponse.redirect(new URL('/fees-collection/student-list', request.url));
        }
        return NextResponse.next();
    }

    if (!parentToken) {
        return NextResponse.redirect(new URL('/fees-collection/student-login', request.url));
    }

    return NextResponse.next();
}
