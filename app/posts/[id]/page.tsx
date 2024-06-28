import client from "@/lib/db";
import getSession from "@/lib/session";
import { formatToTimeAgo } from "@/lib/utils";
import { EyeIcon } from "@heroicons/react/24/solid";
import { unstable_cache as nextCache } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";
import LikeButton from "@/components/like-button";
import { Prisma } from "@prisma/client";
import CommentsList from "@/components/comments-list";

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

const getCachedPost = nextCache(getPost, ["post-detail"], {
  tags: ["post-detail"],
  revalidate: 60,
});

const getLikedStatus = async (postId: number, userId: number) => {
  const isLiked = await client.like.findUnique({
    where: {
      id: {
        postId,
        userId: userId,
      },
    },
  });
  const likeCount = await client.like.count({
    where: {
      postId,
    },
  });
  return {
    likeCount,
    isLiked: Boolean(isLiked),
  };
};

const getCachedLikeStatus = async (postId: number) => {
  const session = await getSession();
  const userId = session.id;
  const cachedOperation = nextCache(getLikedStatus, ["product-like-status"], {
    tags: [`like-status-${postId}`],
  });
  return cachedOperation(postId, userId!);
};

const getComments = async (postId: number) => {
  const comments = await client.comment.findMany({
    where: {
      postId,
    },
    select: {
      id: true,
      payload: true,
      createdAt: true,
      userId: true,
      user: {
        select: {
          avatar: true,
          username: true,
        },
      },
    },
  });
  return comments;
};

export type initialComments = Prisma.PromiseReturnType<typeof getComments>;

const Post = async ({ params }: { params: { id: string } }) => {
  const session = await getSession();
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }
  const post = await getCachedPost(id);
  if (!post) {
    return notFound();
  }
  const { likeCount, isLiked } = await getCachedLikeStatus(id);
  const initialComments = await getComments(id);
  return (
    <div className="flex flex-col gap-5 p-5">
      <div className=" text-white">
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
          <LikeButton isLiked={isLiked} likeCount={likeCount} postId={id} />
        </div>
      </div>
      <CommentsList
        postId={id}
        userId={session.id!}
        username={post.user.username!}
        avatar={post.user.avatar!}
        initialComments={initialComments}
      />
    </div>
  );
};

export default Post;
