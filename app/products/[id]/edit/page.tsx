"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { notFound } from "next/navigation";
import { useForm } from "react-hook-form";
import { productSchema, ProductType } from "../../add/schema";

const EditProduct = async ({ params }: { params: { id: string } }) => {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<ProductType>({
    resolver: zodResolver(productSchema),
  });
  return (
    <div>
      <form className="flex flex-col gap-5 p-5">
        <label
          htmlFor="photo"
          className="flex items-center justify-center flex-col border-neutral-300 border-2 aspect-square
          text-neutral-300 rounded-md border-dashed cursor-pointer bg-center bg-cover"
          // style={{ backgroundImage: `url(${preview})` }}
        >
          {/* {preview === "" ? (
            <>
              <PhotoIcon className="w-28" />
              <div className="text-sm text-neutral-400">
                Add the photo
                {errors.photo?.message}
              </div>
            </>
          ) : null} */}
        </label>
        <input
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
        <Button text="Edit" />
      </form>
    </div>
  );
};

export default EditProduct;
