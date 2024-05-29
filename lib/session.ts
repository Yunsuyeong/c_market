import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

interface ISessionContent {
  id?: number;
}

const getSession = () => {
  return getIronSession<ISessionContent>(cookies(), {
    cookieName: "market-cookie",
    password: process.env.COOKIE_PASSWORD!,
  });
};

export default getSession;
