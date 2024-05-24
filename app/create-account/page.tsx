"use client";

import Input from "@/components/input";
import SocialLogin from "@/components/social-login";
import { useFormState } from "react-dom";
import onSubmit from "./actions";
import Button from "@/components/button";

const CreateAccount = () => {
  const [state, action] = useFormState(onSubmit, null);
  return (
    <div className="flex flex-col gap-10 px-6 py-8">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요</h1>
        <h2 className="text-xl">Fill in the form below to join</h2>
      </div>
      <form action={action} className="flex flex-col gap-3">
        <Input
          name="username"
          required
          type="text"
          placeholder="Username"
          errors={state?.fieldErrors.username}
          minLength={3}
          maxLength={10}
        />
        <Input
          name="email"
          required
          type="email"
          placeholder="Email"
          errors={state?.fieldErrors.email}
        />
        <Input
          required
          name="password"
          type="password"
          placeholder="Password"
          errors={state?.fieldErrors.password}
          minLength={4}
        />
        <Input
          required
          name="confirm_password"
          type="password"
          placeholder="Confirm Password"
          errors={state?.fieldErrors.confirm_password}
          minLength={4}
        />
        <Button text="Create Account" />
      </form>
      <SocialLogin />
    </div>
  );
};

export default CreateAccount;
