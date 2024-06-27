"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { useFormState } from "react-dom";
import { startSream } from "./actions";

const AddStream = () => {
  const [state, action] = useFormState(startSream, null);
  return (
    <form className="flex flex-col gap-2 p-5" action={action}>
      <Input
        name="title"
        required
        placeholder="Title of your stream"
        errors={state?.formErrors}
      />
      <Button text="Start Streaming" />
    </form>
  );
};

export default AddStream;
