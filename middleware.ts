import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || "fallback_secret";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Protect /admin and its subroutes, except /admin/login
    if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
        const session = request.cookies.get("admin_session");

        if (!session || session.value !== ADMIN_SECRET_KEY) {
            const url = request.nextUrl.clone();
            url.pathname = "/admin/login";
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
