export const getUserProfile = async (access_token: string) => {
  const userProfileRes = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    cache: "no-cache",
  });
  const { id, login, avatar_url } = await userProfileRes.json();
  return { id, login, avatar_url };
};

export const getUserEmail = async (access_token: string) => {
  interface IEmailRes {
    email: string;
    primary: boolean;
    verified: boolean;
  }

  const emailRes: IEmailRes[] = await (
    await fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      cache: "no-cache",
    })
  ).json();
  const email = emailRes.filter((email) => email.verified && email.primary)[0]
    ?.email;
  return email;
};

const getAccessToken = async (code: string) => {
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
  return { error, access_token };
};

export default getAccessToken;
