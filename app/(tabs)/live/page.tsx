import client from "@/lib/db";
import { PlusIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { formatToTimeAgo } from "@/lib/utils";

const getStreams = async () => {
  const streams = await client.liveStream.findMany({
    select: {
      id: true,
      title: true,
      createdAt: true,
      userId: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return streams;
};

const Live = async () => {
  const streams = await getStreams();
  return (
    <div>
      {streams.map((stream) => (
        <Link href={`/streams/${stream.id}`} key={stream.id} className="p-10">
          <div className="relative aspect-video"></div>
          <iframe
            src={`https://${process.env.CLOUDFLARE_DOMAIN}/dc98714ad120275903d1c681fa987fbc/iframe`}
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
            className="w-full h-full rounded-md"
          ></iframe>
          <div className="flex items-center gap-3 p-5 border-b border-neutral-700"></div>
          <div className="flex gap-2 p-5">
            <h1 className="text-2xl font-semibold">{stream.title}</h1>
            <span className="text-sm text-neutral-500">
              {formatToTimeAgo(stream.createdAt.toString())}
            </span>
          </div>
        </Link>
      ))}
      <Link
        href="/streams/add"
        className="flex items-center justify-center fixed bottom-24 right-8 size-16 rounded-full bg-orange-500 text-white
        transition-colors hover:bg-orange-400"
      >
        <PlusIcon className="size-10" />
      </Link>
    </div>
  );
};

export default Live;
