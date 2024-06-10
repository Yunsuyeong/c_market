import CloseButton from "@/components/close-button";
import { PhotoIcon } from "@heroicons/react/24/solid";

export default async function Modal({ params }: { params: { id: string } }) {
  return (
    <div
      className="absolute w-full h-full left-0 top-0 z-50 flex justify-center items-center
    bg-black bg-opacity-60"
    >
      <CloseButton />
      <div className="max-w-screen-sm w-full h-1/2 flex justify-center">
        <div
          className="flex justify-center items-center aspect-square bg-neutral-700
      rounded-md text-neutral-200"
        >
          <PhotoIcon className="h-28" />
        </div>
      </div>
    </div>
  );
}
