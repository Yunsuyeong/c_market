"use client";

import { HandThumbUpIcon } from "@heroicons/react/24/solid";
import { HandThumbUpIcon as OutlineHandThumbUpIcon } from "@heroicons/react/24/outline";
import { useOptimistic } from "react";
import { dislikePost, likePost } from "@/app/posts/[id]/actions";
interface ILikeButton {
  isLiked: boolean;
  likeCount: number;
  postId: number;
}

const LikeButton = ({ isLiked, likeCount, postId }: ILikeButton) => {
  const [state, reducer] = useOptimistic(
    { isLiked, likeCount },
    (prevStatus, payload) => ({
      isLiked: !prevStatus.isLiked,
      likeCount: prevStatus.isLiked
        ? prevStatus.likeCount - 1
        : prevStatus.likeCount + 1,
    })
  );
  const onClick = async () => {
    reducer(undefined);
    if (isLiked) {
      await dislikePost(postId);
    } else {
      await likePost(postId);
    }
  };
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 p-2 text-neutral-400
          text-sm border border-neutral-400 rounded-full
          ${
            state.isLiked
              ? "bg-orange-500 text-white border-orange-500"
              : "hover:bg-neutral-800"
          }`}
    >
      {state.isLiked ? (
        <HandThumbUpIcon className="size-5" />
      ) : (
        <OutlineHandThumbUpIcon className="size-5" />
      )}
      <span>
        {state.isLiked ? (
          <span>{state.likeCount}</span>
        ) : (
          <span>공감하기({state.likeCount})</span>
        )}
      </span>
    </button>
  );
};

export default LikeButton;
