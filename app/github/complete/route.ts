//complete 단계에서는 github에서 제공하는 code를 로그인에 필요한 access token으로 바꿔야 함

import client from "@/lib/db";
import getSession from "@/lib/session";
import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";

export const GET = async (req: NextRequest) => {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) {
    return notFound();
  }
  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    client_secret: process.env.GITHUB_CLIENT_SECRET!,
    code,
  }).toString();
  const accessTokenURL = `https://github.com/login/oauth/access_token?${params}`;
  const { error, access_token } = await (
    await fetch(accessTokenURL, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  if (error) {
    return new NextResponse(null, {
      status: 400,
    });
  }
  const userProfileRes = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    cache: "no-cache",
  });
  const { id, avatar_url, login } = await userProfileRes.json();
  const user = await client.user.findUnique({
    where: {
      github_id: id + "",
    },
    select: {
      id: true,
    },
  });
  if (user) {
    const session = await getSession();
    session.id = user.id;
    await session.save();
    return redirect("/profile");
  }
  const newUser = await client.user.create({
    data: {
      username: `${login}-gh`,
      github_id: id + "",
      avatar: avatar_url,
    },
    select: {
      id: true,
    },
  });
  const session = await getSession();
  session.id = newUser.id;
  await session.save();
  return redirect("/profile");
};
