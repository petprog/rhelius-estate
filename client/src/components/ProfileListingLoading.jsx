import { Shimmer } from "react-shimmer";

export default function ProfileListingLoading() {
  return (
    <div className="mt-5">
      <Shimmer className="mb-2 self-center" width={100} height={30} />
      <div className="flex mt-5 gap-4  items-center">
        <Shimmer width={64} height={64} />
        <Shimmer className="flex-1" width={120} height={18} />

        <div className="flex w-20 justify-between gap-4 ">
          <Shimmer height={30} width={30} />
          <Shimmer height={30} width={30} />
        </div>
      </div>

      <div className="flex mt-5 gap-4  items-center">
        <Shimmer width={64} height={64} />
        <Shimmer className="flex-1" width={200} height={18} />

        <div className="flex w-20 justify-between gap-4 ">
          <Shimmer height={30} width={30} />
          <Shimmer height={30} width={30} />
        </div>
      </div>
    </div>
  );
}
