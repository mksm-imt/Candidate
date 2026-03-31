export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/offers/:path*",
    "/applications/:path*",
    "/settings/:path*",
  ],
};
