const Loading = () => {
  return (
    <div className="flex flex-col gap-5 p-5 animate-pulse">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="*:rounded-md flex gap-5 ">
          <div className="flex flex-col gap-2 *:rounded-md">
            <div className="bg-neutral-700 w-20 h-5" />
            <div className="bg-neutral-700 w-40 h-5" />
            <div className="flex gap-2 *:rounded-md">
              <div className="bg-neutral-700 w-5 h-5" />
              <div className="bg-neutral-700 w-5 h-5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Loading;
