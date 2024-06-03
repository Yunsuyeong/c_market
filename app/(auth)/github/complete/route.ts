//complete 단계에서는 github에서 제공하는 code를 로그인에 필요한 access token으로 바꿔야 함

import client from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { userLogin } from "@/app/login/actions";
import getAccessToken, { getUserEmail, getUserProfile } from "@/lib/github";

export const GET = async (req: NextRequest) => {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) {
    return notFound();
  }
  const { error, access_token } = await getAccessToken(code);
  if (error) {
    return new NextResponse(null, {
      status: 400,
    });
  }
  const { id, login, avatar_url } = await getUserProfile(access_token);
  const email = await getUserEmail(access_token);
  const user = await client.user.findFirst({
    where: {
      OR: [{ email: email ?? "" }, { github_id: id + "" }],
    },
    select: {
      id: true,
    },
  });
  if (user) {
    userLogin(user.id);
    return redirect("/profile");
  }
  const existsUsername = await client.user.findUnique({
    where: {
      username: login,
    },
    select: {
      id: true,
    },
  });
  // To avoid duplicate username values, a random number is added after it
  const newUser = await client.user.create({
    data: {
      username: existsUsername
        ? `${login}-${Math.round((Math.random() * 1000 + 1) * 10) / 10}`
        : login,
      email,
      github_id: id + "",
      avatar: avatar_url,
    },
    select: {
      id: true,
      username: true,
    },
  });
  userLogin(newUser.id);
  return redirect("/profile");
};
