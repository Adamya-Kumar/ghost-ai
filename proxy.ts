import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

function publicAuthPaths() {
  return [
    process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
    process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
  ].filter((path): path is string => Boolean(path));
}

function isPublicAuthRoute(pathname: string) {
  return publicAuthPaths().some((path) => {
    const normalized = path.startsWith("/") ? path : `/${path}`;
    return pathname === normalized || pathname.startsWith(`${normalized}/`);
  });
}

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;

  if (isPublicAuthRoute(pathname)) {
    return;
  }

  if (pathname === "/") {
    const { userId } = await auth();
    const destination = userId
      ? "/editor"
      : process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL!;
    return NextResponse.redirect(new URL(destination, req.url));
  }

  await auth.protect();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/(.*)",
  ],
};
