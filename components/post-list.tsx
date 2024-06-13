import ListPost from "./list-post";

interface IPostList {
  posts: {
    id: number;
    title: string;
    description: string | null;
    createdAt: Date;
    _count: {
      comments: number;
      likes: number;
    };
    views: number;
  }[];
}

const PostList = ({ posts }: IPostList) => {
  return (
    <div className="flex flex-col p-5">
      {posts.map((post) => (
        <ListPost
          key={post.id}
          id={post.id}
          title={post.title}
          description={post.description}
          createdAt={post.createdAt}
          views={post.views}
          _count={post._count}
        />
      ))}
    </div>
  );
};

export default PostList;
