//oauth App에 url을 통해 정보를 넘겨 Authentication 페이지로 이동시킴

import { redirect } from "next/navigation";

export const GET = async () => {
  let baseURL = "https://github.com/login/oauth/authorize";
  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    scope: "read:user,user:email",
    allow_signup: "true",
  }).toString();
  baseURL = `${baseURL}?${params}`;
  return redirect(baseURL);
};
