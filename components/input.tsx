import { InputHTMLAttributes } from "react";

interface IInput {
  errors?: string[];
  name: string;
}

const Input = ({
  errors = [],
  name,
  ...rest
}: IInput & InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <div className="flex flex-col gap-2">
      <input
        className="bg-transparent rounded-md w-full h-10 focus:outline-none ring-2 transition
            focus:ring-4 ring-neutral-200 focus:ring-orange-500 border-none placeholder:text-neutral-400"
        name={name}
        {...rest}
      />
      {errors?.map((error, i) => (
        <span key={i} className="text-red-500 font-medium">
          {error}
        </span>
      ))}
    </div>
  );
};

export default Input;
