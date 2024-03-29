import { Shimmer } from "react-shimmer";

export default function ListingLoading() {
  return (
    <div className="p-7 flex gap-6">
      <div className=" flex flex-col gap-2">
        <Shimmer width={190} height={120} />
        <div className="p-2 flex flex-col gap-1 items-start">
          <Shimmer width={170} height={20} />
          <Shimmer width={170} height={10} />
          <Shimmer width={170} height={30} />
          <Shimmer width={100} height={20} />
          <div className="flex gap-3">
            <Shimmer className="" width={50} height={10} />
            <Shimmer className="" width={50} height={10} />
          </div>
        </div>
      </div>
      <div className=" flex flex-col gap-2">
        <Shimmer width={200} height={120} />
        <div className="p-2 flex flex-col gap-1 items-start">
          <Shimmer width={170} height={20} />
          <Shimmer width={170} height={10} />
          <Shimmer width={170} height={30} />
          <Shimmer width={100} height={20} />
          <div className="flex gap-3">
            <Shimmer className="" width={50} height={10} />
            <Shimmer className="" width={50} height={10} />
          </div>
        </div>
      </div>
    </div>
  );
}
