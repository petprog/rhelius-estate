import { Routes, Route } from "react-router-dom";
import {
  Home,
  About,
  Login,
  Profile,
  SignUp,
  CreateOrUpdateListing,
  Missing,
  Listing,
  Search,
} from "./pages";
import { Header, PrivateRoute } from "./components";
export default function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/listings/:listingId" element={<Listing />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route
            path="/listing/:listingId"
            element={<CreateOrUpdateListing />}
          />
        </Route>
        <Route path="/search" element={<Search />} />
        <Route path="*" element={<Missing />} />
      </Routes>
    </div>
  );
}
