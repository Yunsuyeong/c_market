import PostList from "@/components/post-list";
import client from "@/lib/db";

const getPosts = async () => {
  const posts = await client.post.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      views: true,
      createdAt: true,
      _count: {
        select: {
          comments: true,
          likes: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return posts;
};

export const metadata = {
  title: "동네생활",
};

const Life = async () => {
  const posts = await getPosts();
  return (
    <div>
      <PostList posts={posts} />
    </div>
  );
};

export default Life;
