"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { useFormState } from "react-dom";
import { uploadProduct } from "./actions";

const AddProduct = () => {
  const [preview, setPreview] = useState("");
  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;
    if (!files) {
      return;
    }
    const file = files[0];
    const url = URL.createObjectURL(file);
    setPreview(url);
  };
  const [state, action] = useFormState(uploadProduct, null);
  return (
    <div>
      <form action={action} className="flex flex-col gap-5 p-5">
        <label
          htmlFor="photo"
          className="flex items-center justify-center flex-col border-neutral-300 border-2 aspect-square
          text-neutral-300 rounded-md border-dashed cursor-pointer bg-center bg-cover"
          style={{ backgroundImage: `url(${preview})` }}
        >
          {preview === "" ? (
            <>
              <PhotoIcon className="w-28" />
              <div className="text-sm text-neutral-400">Add the photo</div>
            </>
          ) : null}
        </label>
        <input
          onChange={onImageChange}
          type="file"
          id="photo"
          name="photo"
          className="hidden"
        />
        <Input
          name="title"
          required
          placeholder="Title"
          type="text"
          errors={state?.fieldErrors.title}
        />
        <Input
          name="price"
          required
          placeholder="Price"
          type="number"
          errors={state?.fieldErrors.price}
        />
        <Input
          name="description"
          required
          placeholder="Description"
          type="text"
          errors={state?.fieldErrors?.description}
        />
        <Button text="Add" />
      </form>
    </div>
  );
};

export default AddProduct;
