"use server";

const onSubmit = async (prev: any, formData: FormData) => {
  console.log(prev);
  await new Promise((resolve) => setTimeout(resolve, 5000));
  return {
    errors: ["wrong password.", "password too short"],
  };
};

export default onSubmit;
