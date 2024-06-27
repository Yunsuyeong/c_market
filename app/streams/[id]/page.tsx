import client from "@/lib/db";
import getSession from "@/lib/session";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { notFound } from "next/navigation";

const getStream = async (id: number) => {
  const stream = await client.liveStream.findUnique({
    where: {
      id,
    },
    select: {
      title: true,
      stream_key: true,
      stream_id: true,
      userId: true,
      user: {
        select: {
          avatar: true,
          username: true,
        },
      },
    },
  });
  return stream;
};

const Stream = async ({ params }: { params: { id: string } }) => {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }
  const stream = await getStream(id);
  if (!stream) {
    return notFound();
  }
  const session = await getSession();
  return (
    <div className="p-10">
      <div className="relative aspect-video"></div>
      <iframe
        src={`https://${process.env.CLOUDFLARE_DOMAIN}/dc98714ad120275903d1c681fa987fbc/iframe`}
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
        className="w-full h-full rounded-md"
      ></iframe>
      <div className="flex items-center gap-3 p-5 border-b border-neutral-700">
        <div className="size-10 overflow-hidden rounded-full">
          {stream.user.avatar !== null ? (
            <Image
              src={stream.user.avatar!}
              alt={stream.user.username}
              width={40}
              height={40}
            />
          ) : (
            <UserIcon />
          )}
        </div>
        <div>
          <h3>{stream.user.username}</h3>
        </div>
      </div>
      <div className="p-5">
        <h1 className="text-2xl font-semibold">{stream.title}</h1>
      </div>
      {stream.userId === session.id ? (
        <div className="bg-yellow-200 text-black rounded-md p-5">
          <div className="flex gap-2">
            <span className="font-semibold">Stream URL:</span>
            <span>rtmps://live.cloudflare.com:443/live/</span>
          </div>
          <div className="flex flex-wrap">
            <span className="font-semibold">Secret Key:</span>
            <span>{stream.stream_key}</span>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Stream;
