import { Link } from "react-router-dom";
const Missing = () => {
  return (
    <main className="flex flex-col min-h-[calc(100vh-72px)] justify-center items-center gap-4">
      <h1 className="font-bold text-8xl">404</h1>
      <p className="text-4xl font-semibold">Oops! That page can’t be found.</p>
      <Link className="underline text-2xl" to="/">
        Visit Our Homepage
      </Link>
    </main>
  );
};

export default Missing;
