import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ListingDetailsLoading from "../components/ListingDetailsLoading";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const params = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      setError(null);
      try {
        // await new Promise((resolve) => setTimeout(resolve, 10000));
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success) {
          setListing(data.data);
          setLoading(false);
          setError(null);
        }
      } catch (error) {
        setLoading(false);
        setError(error.message);
      }
    };

    fetchListing();
  }, [params.listingId]);
  return (
    <main className="min-h-[calc(100vh-72px)]">
      {loading && <ListingDetailsLoading />}
      {error && (
        <p className="text-3xl text-center my-7 ">Something went wrong</p>
      )}
      {!loading && !error && listing && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((imageUrl) => (
              <SwiperSlide key={imageUrl}>
                <div
                  className={`h-[300px]`}
                  style={{
                    background: `url(${imageUrl}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </main>
  );
}
