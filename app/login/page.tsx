"use client";

import Input from "@/components/input";
import SocialLogin from "@/components/social-login";
import { useFormState } from "react-dom";
import onSubmit from "./actions";
import Button from "@/components/button";

// NextJs.14에서 Server Actions 기능 추가
// useFormStatus -  form의 자식 element에서 사용해 form의 상태에 따라 UI 변경 등 상호작용, 해당 Hook이 사용된 파일 상단에 "use client"; 붙여야 함
/* useFormState - form이 제출될 때 해당 form의 action을 보고 새로운 state에 따라 UI 변경, 파일 상단에 "use client"; 붙여야 함,
useFormState가 받는 action 함수는 서버에서만 실행되기 때문에 별도의 파일로 작성해야 함. 해당 파일에서는 상단에 "use server"; 붙여야 함 */

const Login = () => {
  const [state, action] = useFormState(onSubmit, {
    anyValue: 1,
  } as any);
  return (
    <div className="flex flex-col gap-10 px-6 py-8">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">こんにちは。</h1>
        <h2 className="text-xl">Login with email and password.</h2>
      </div>
      <form action={action} className="flex flex-col gap-3">
        <Input
          name="email"
          required
          type="email"
          placeholder="Email"
          errors={[]}
        />
        <Input
          name="password"
          required
          type="password"
          placeholder="Password"
          errors={state?.errors ?? []}
        />
        <Button text="Login" />
      </form>
      <SocialLogin />
    </div>
  );
};

export default Login;
