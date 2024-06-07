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
  "/github/start": true,
  "/github/complete": true,
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
      return NextResponse.redirect(new URL("/home", req.url));
    }
  }
};

//middleware가 실행되게 할 파일의 url을 config로 설정 가능

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
