"use server";

import client from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";
import { z } from "zod";

const title = z.string().min(4);

export const startSream = async (_: any, formData: FormData) => {
  const results = title.safeParse(formData.get("title"));
  if (!results.success) {
    return results.error.flatten();
  }
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/stream/live_inputs`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_TOKEN}`,
      },
      body: JSON.stringify({
        meta: {
          name: results.data,
        },
        recording: {
          mode: "automatic",
        },
      }),
    }
  );
  const session = await getSession();
  const data = await res.json();
  const stream = await client.liveStream.create({
    data: {
      title: results.data,
      stream_id: data.result.uid,
      stream_key: data.result.rtmps.streamKey,
      userId: session.id!,
    },
    select: {
      id: true,
    },
  });
  redirect(`/streams/${stream.id}`);
};
