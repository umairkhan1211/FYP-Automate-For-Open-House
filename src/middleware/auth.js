import { NextResponse } from "next/server";

export function middleware(request) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;

  // Define role-based paths
  const rolePaths = {
    student: ["/studentportal", "/studentportal/Upload", "/studentportal/Preview"],
    supervisor: ["/supervisorportal", "/supervisorportal/Review"],
    qa: ["/QAportal", "/QAportal/Review"],
    hod: ["/HODportal"],
  };

  const isPublicPath =  path === "/";
  
  // Handle logged-in users on public paths
  if (isPublicPath && token) {
    const redirects = {
      student: "/studentportal",
      supervisor: "/supervisorportal",
      qa: "/QAportal",
      hod: "/HODportal",
    };
    if (redirects[role]) {
      return NextResponse.redirect(new URL(redirects[role], request.url));
    }
  }

  // Redirect non-logged-in users
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Handle role-based path restrictions
  if (token && rolePaths[role] && !rolePaths[role].some((r) => path.startsWith(r))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Default fallback for unsupported roles
  if (token && !rolePaths[role]) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/studentportal/:path*",
    "/supervisorportal/:path*",
    "/QAportal/:path*",
    "/HODportal/:path*",
  ],
};
