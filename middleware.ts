import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
    '/dashboard(.*)',
    '/forum(.*)',
]);

// These public files must NEVER be intercepted by Clerk
const PUBLIC_FILES = ['/sitemap.xml', '/robots.txt', '/llms.txt', '/favicon.ico'];

export default clerkMiddleware(async (auth, req) => {
    const { pathname } = req.nextUrl;

    // Explicitly bypass Clerk for public crawlable files
    if (PUBLIC_FILES.includes(pathname)) {
        return NextResponse.next();
    }

    if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
    matcher: [
        // Skip _next and static assets
        "/((?!_next/static|_next/image|.*\\.png$|.*\\.jpg$|.*\\.svg$|.*\\.ico$).*)",
        "/",
    ],
};
