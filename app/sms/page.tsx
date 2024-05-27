"use client";

import Input from "@/components/input";
import Button from "@/components/button";
import onSubmit from "./actions";
import { useFormState } from "react-dom";

const initialState = {
  token: false,
  error: undefined,
};

const SMSLogin = () => {
  const [state, action] = useFormState(onSubmit, initialState);
  return (
    <div className="flex flex-col gap-10 px-6 py-8">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">SMS Login</h1>
        <h2 className="text-xl">Verify your phone number</h2>
      </div>
      <form action={action} className="flex flex-col gap-3">
        {state.token ? (
          <Input
            name="token"
            required
            type="number"
            min={100000}
            max={999999}
            placeholder="Verification Code"
          />
        ) : (
          <Input
            name="phone"
            required
            type="text"
            placeholder="Phone number"
            errors={state?.error?.formErrors}
          />
        )}
        <Button text={state.token ? "Verify Token" : "Send verification SMS"} />
      </form>
    </div>
  );
};

export default SMSLogin;
