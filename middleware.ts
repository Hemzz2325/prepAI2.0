import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
    '/dashboard(.*)',
    '/forum(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
    if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
    matcher: [
        // Skip static files, _next, sitemap.xml, robots.txt, llms.txt
        "/((?!.*\\..*|_next|sitemap\\.xml|robots\\.txt|llms\\.txt|favicon\\.ico).*)",
        "/",
        "/(api|trpc)(.*)",
    ],
};
