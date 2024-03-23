import { useEffect, useState } from "react";
import { Shimmer } from "react-shimmer";

export default function ListingDetailsLoading() {
  const [width, setWidth] = useState(window.innerWidth);
  const height = window.innerHeight;

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex flex-col gap-4 items-center">
      <Shimmer width={width} height={height * 0.4} />
      <div className=" flex flex-col gap-3">
        <Shimmer className="mb-2" width={width * 0.4} height={25} />
        <Shimmer width={width * 0.2} height={15} />
        <Shimmer width={width * 0.15} height={25} />
        <Shimmer width={width * 0.6} height={70} />
        <div className="flex gap-6">
          <Shimmer width={width * 0.1} height={15} />
          <Shimmer width={width * 0.1} height={15} />
          <Shimmer width={width * 0.1} height={15} />
        </div>
      </div>
    </div>
  );
}
