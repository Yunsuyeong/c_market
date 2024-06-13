import client from "@/lib/db";
import getSession from "@/lib/session";
import { formatToTimeAgo } from "@/lib/utils";
import { EyeIcon, HandThumbUpIcon } from "@heroicons/react/24/solid";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";

const getPost = async (id: number) => {
  try {
    const post = await client.post.update({
      where: {
        id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
      include: {
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });
    return post;
  } catch (e) {
    console.log(e);
    return null;
  }
};

const getIsLiked = async (postId: number) => {
  const session = await getSession();
  const like = await client.like.findUnique({
    where: {
      id: {
        postId,
        userId: session.id!,
      },
    },
  });
  return Boolean(like);
};

const Post = async ({ params }: { params: { id: string } }) => {
  const session = await getSession();
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }
  const post = await getPost(id);
  if (!post) {
    return notFound();
  }
  const isLiked = await getIsLiked(id);
  const likePost = async () => {
    "use server";
    try {
      await client.like.create({
        data: {
          postId: id,
          userId: session.id!,
        },
      });
      revalidatePath(`/post/${id}`);
    } catch (e) {}
  };
  const dislikePost = async () => {
    "use server";
    try {
      await client.like.delete({
        where: {
          id: {
            postId: id,
            userId: session.id!,
          },
        },
      });
      revalidatePath(`/post/${id}`);
    } catch (e) {}
  };
  return (
    <div className="p-5 text-white">
      <div className="flex items-center gap-2 mb-2">
        {post.user.avatar ? (
          <Image
            width={28}
            height={28}
            className="size-7 rounded-full"
            src={post.user.avatar!}
            alt={post.user.username}
          />
        ) : (
          <div className="size-7 rounded-full bg-neutral-500" />
        )}
        <div>
          <span className="text-sm font-semibold">{post.user.username}</span>
          <div className="text-xs">
            <span>{formatToTimeAgo(post.createdAt.toString())}</span>
          </div>
        </div>
      </div>
      <h2 className="text-lg font-semibold">{post.title}</h2>
      <p className="mb-5">{post.description}</p>
      <div className="flex flex-col gap-5 items-start">
        <div className="flex items-center gap-2 text-neutral-400 text-sm">
          <EyeIcon className="size-5" />
          <span>조회 {post.views}</span>
        </div>
        <form action={isLiked ? dislikePost : likePost}>
          <button
            className={`flex items-center gap-2 p-2 text-neutral-400
          text-sm border border-neutral-400 rounded-full`}
          >
            <HandThumbUpIcon className="size-5" />
            <span>
              {isLiked ? "공감 취소" : "공감하기"} ({post._count.likes})
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Post;
