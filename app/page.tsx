import Link from "next/link";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-between min-h-screen p-6">
      <div className="flex flex-col items-center my-auto *:font-medium">
        <span className="text-9xl"></span>
        <h1 className="text-4xl">당근</h1>
        <h2 className="tet-2xl">당근 마켓에 오시오</h2>
      </div>
      <div className="w-full flex flex-col items-center gap-3">
        <Link href="/create-account" className="primary-btn py-2.5 text-lg">
          시작
        </Link>
        <div className="flex gap-2">
          <span>이미 계정이 있나요</span>
          <Link href="/login" className="hover:underline underline-offset-3">
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
