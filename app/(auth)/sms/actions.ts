"use server";

import { z } from "zod";
import validator from "validator";
import { redirect } from "next/navigation";
import client from "@/lib/db";
import crypto from "crypto";
import getSession from "@/lib/session";
import twilio from "twilio";

interface IActionState {
  token: boolean;
}

const phoneSchema = z
  .string()
  .trim()
  .refine(
    (phone) => validator.isMobilePhone(phone, "ja-JP"),
    "Wrong Phone format"
  );

const tokenExists = async (token: number) => {
  const exists = await client.token.findUnique({
    where: {
      token: token.toString(),
    },
    select: {
      id: true,
    },
  });
  return Boolean(exists);
};

const tokenSchema = z.coerce
  .number()
  .min(100000)
  .max(999999)
  .refine(tokenExists, "This token doesn't exists");

const getToken = async (): Promise<any> => {
  const token = crypto.randomInt(100000, 999999).toString();
  const exists = await client.token.findUnique({
    where: {
      token,
    },
    select: {
      id: true,
    },
  });
  if (exists) {
    return getToken();
  } else {
    return token;
  }
};

const onSubmit = async (prev: IActionState, formData: FormData) => {
  const phone = formData.get("phone");
  const token = formData.get("token");
  if (!prev.token) {
    const result = await phoneSchema.spa(phone);
    if (!result.success) {
      return {
        token: false,
        error: result.error.flatten(),
      };
    } else {
      await client.token.deleteMany({
        where: {
          user: {
            phone: result.data,
          },
        },
      });
      const token = await getToken();
      await client.token.create({
        data: {
          token,
          user: {
            connectOrCreate: {
              where: {
                phone: result.data,
              },
              create: {
                username: crypto.randomBytes(10).toString("hex"),
                phone: result.data,
              },
            },
          },
        },
      });
      const twilioClient = twilio(
        process.env.TWILIO_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
      await twilioClient.messages.create({
        body: `Your verification code is ${token}`,
        from: process.env.TWILIO_NUMBER!,
        to: process.env.MY_NUMBER!,
      });
      return {
        token: true,
      };
    }
  } else {
    const result = tokenSchema.safeParse(token);
    if (!result.success) {
      return {
        token: true,
        error: result.error.flatten(),
      };
    } else {
      const token = await client.token.findUnique({
        where: {
          token: result.data.toString(),
        },
        select: {
          id: true,
          userId: true,
        },
      });
      if (token) {
        const session = await getSession();
        session.id = token.userId;
        await session.save();
        await client.token.delete({
          where: {
            id: token.id,
          },
        });
      }
      redirect("/");
    }
  }
};

export default onSubmit;
