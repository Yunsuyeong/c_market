"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { getUploadUrl, uploadProduct } from "./actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, ProductType } from "./schema";

const AddProduct = () => {
  const [preview, setPreview] = useState("");
  const [uploadURL, setUploadURL] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<ProductType>({
    resolver: zodResolver(productSchema),
  });
  const onImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;
    if (!files) {
      return;
    }
    const file = files[0];
    const url = URL.createObjectURL(file);
    setPreview(url);
    setFile(file);
    const { success, result } = await getUploadUrl();
    if (success) {
      const { id, uploadUrl } = result;
      setUploadURL(uploadUrl);
      setValue(
        "photo",
        `https://imagedelivery.net/R0rRD058TrD049hkghsSqQ/${id}`
      );
    }
  };
  const onSubmit = handleSubmit(async (form: ProductType) => {
    if (!file) {
      return;
    }
    const cloudflareForm = new FormData();
    cloudflareForm.append("file", file);
    const res = await fetch(uploadURL, {
      method: "POST",
      body: cloudflareForm,
    });
    if (res.status !== 200) {
      return;
    }
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("price", form.price + "");
    formData.append("description", form.description);
    formData.append("photo", form.photo);
    const errors = await uploadProduct(formData);
    if (errors) {
      //setError()
    }
  });
  const onValid = async () => {
    await onSubmit();
  };
  return (
    <div>
      <form action={onValid} className="flex flex-col gap-5 p-5">
        <label
          htmlFor="photo"
          className="flex items-center justify-center flex-col border-neutral-300 border-2 aspect-square
          text-neutral-300 rounded-md border-dashed cursor-pointer bg-center bg-cover"
          style={{ backgroundImage: `url(${preview})` }}
        >
          {preview === "" ? (
            <>
              <PhotoIcon className="w-28" />
              <div className="text-sm text-neutral-400">
                Add the photo
                {errors.photo?.message}
              </div>
            </>
          ) : null}
        </label>
        <input
          onChange={onImageChange}
          type="file"
          id="photo"
          name="photo"
          accept="image/*"
          className="hidden"
        />
        <Input
          required
          placeholder="Title"
          type="text"
          {...register("title")}
          errors={[errors.title?.message ?? ""]}
        />
        <Input
          required
          placeholder="Price"
          type="number"
          {...register("price")}
          errors={[errors.price?.message ?? ""]}
        />
        <Input
          required
          placeholder="Description"
          type="text"
          {...register("description")}
          errors={[errors.description?.message ?? ""]}
        />
        <Button text="Add" />
      </form>
    </div>
  );
};

export default AddProduct;
