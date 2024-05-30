//middleware - 웹 페이지의 모든 request에 대해 각각 실행됨

import { NextRequest, NextResponse } from "next/server";
import getSession from "./lib/session";

interface IRoute {
  [key: string]: boolean;
}

const publicUrl: IRoute = {
  "/": true,
  "/login": true,
  "/sms": true,
  "/create-account": true,
};

export const middleware = async (req: NextRequest) => {
  const session = await getSession();
  const exists = publicUrl[req.nextUrl.pathname];
  if (!session.id) {
    if (!exists) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  } else {
    if (exists) {
      return NextResponse.redirect(new URL("/products", req.url));
    }
  }
};

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
