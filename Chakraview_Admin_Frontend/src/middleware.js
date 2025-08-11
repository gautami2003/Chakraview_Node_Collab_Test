import { NextResponse } from 'next/server';
import { checkTokenMiddleware } from './lib/middleware/checkToken';
import { checkParentTokenMiddleware } from './lib/middleware/checkParentToken';

export function middleware(request) {
    const { pathname } = request.nextUrl;

    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/favicon.ico') ||
        pathname.startsWith('/images') ||
        pathname.startsWith('/logo') ||
        pathname.startsWith('/api')
    ) {
        return NextResponse.next();
    }

    if (pathname.startsWith('/fees-collection')) {
        const parentCheck = checkParentTokenMiddleware(request);
        if (parentCheck instanceof Response) return parentCheck;
    }

    const tokenCheck = checkTokenMiddleware(request);
    if (tokenCheck instanceof Response) return tokenCheck;

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
