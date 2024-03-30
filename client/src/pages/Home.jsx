import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaChevronCircleRight } from "react-icons/fa";
import ListingTile from "../components/ListingTile";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";

export default function Home() {
  SwiperCore.use([Navigation]);
  const [offerListings, setOfferListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  console.log(offerListings);
  console.log(rentListings);
  console.log(saleListings);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch("/api/listing/get?offer=true&limit=4");
        const data = await res.json();
        setOfferListings(data.data);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=rent&limit=4");
        const data = await res.json();
        setRentListings(data.data);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchSaleListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=sale&limit=4");
        const data = await res.json();
        setSaleListings(data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListings();
    fetchRentListings();
    fetchSaleListings();
  }, []);
  return (
    <main className="min-h-[calc(100vh-72px)]">
      {/* top */}
      <section className="min-h-[calc(100vh-72px)] max-w-6xl mx-auto py-7 px-5 flex flex-col gap-8">
        <h1 className="mt-7 text-slate-700 font-bold text-4xl sm:text-6xl ">
          Find your next <span className="text-slate-500">perfect</span>
          <br />
          place with ease
        </h1>
        <p className="text-slate-500 text-sm sm:text-lg">
          Rhelius Estate will help you find your next perfect place to live
          comfortably <br />
          We have a wide range of homes for you to choose from.
        </p>
        <Link
          to="/search"
          className=" flex gap-3 justify-center  items-center mt-7 text-base sm:text-lg bg-slate-700 hover:bg-slate-600  rounded-full w-[200px] text-center p-5 text-white"
        >
          Search homes{" "}
          <div>
            <FaChevronCircleRight className="text-base sm:text-lg " />
          </div>
        </Link>
      </section>
      {/* swiper */}
      {offerListings && offerListings.length > 0 && (
        <Swiper navigation>
          {offerListings.map((listing) => (
            <SwiperSlide key={listing.imageUrls[0]}>
              <div
                className={`h-[calc(100vh-72px)]`}
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
              ></div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      {/* listing */}
      <section className="min-h-[calc(100vh-72px)] p-10 max-w-6xl mx-auto">
        <div className="mb-3 flex justify-between">
          <h2 className="text-xl sm:text-2xl text-slate-700 mb-2 font-semibold">
            Recent offers
          </h2>
          <Link
            className=" flex gap-2 items-center font-semibold text-slate-700"
            to="/search?offer=true"
          >
            Show more <FaChevronCircleRight />
          </Link>
        </div>
        <div className="flex flex-wrap gap-8">
          {offerListings &&
            offerListings.length > 0 &&
            offerListings.map((listing) => (
              <ListingTile key={listing._id} listing={listing} />
            ))}
        </div>
      </section>

      <section className="min-h-[calc(100vh-72px)] p-10 max-w-6xl mx-auto">
        <div className="mb-3 flex justify-between">
          <h2 className="text-xl sm:text-2xl text-slate-700 mb-2 font-semibold">
            Recent place for rent
          </h2>
          <Link
            className=" flex gap-2 items-center font-semibold text-slate-700"
            to="/search?type=rent"
          >
            Show more <FaChevronCircleRight />
          </Link>
        </div>
        <div className="flex flex-wrap gap-8">
          {rentListings &&
            rentListings.length > 0 &&
            rentListings.map((listing) => (
              <ListingTile key={listing._id} listing={listing} />
            ))}
        </div>
      </section>
      <section className="min-h-[calc(100vh-72px)] p-10 max-w-6xl mx-auto">
        <div className="mb-3 flex justify-between">
          <h2 className="text-xl sm:text-2xl text-slate-700 mb-2 font-semibold">
            Recent place for sale
          </h2>
          <Link
            className=" flex gap-2 items-center font-semibold text-slate-700"
            to="/search?type=sale"
          >
            Show more <FaChevronCircleRight />
          </Link>
        </div>

        <div className="flex flex-wrap gap-8">
          {saleListings &&
            saleListings.length > 0 &&
            saleListings.map((listing) => (
              <ListingTile key={listing._id} listing={listing} />
            ))}
        </div>
      </section>
    </main>
  );
}
