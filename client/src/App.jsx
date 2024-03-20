import { Routes, Route } from "react-router-dom";
import {
  Home,
  About,
  Login,
  Logout,
  Profile,
  SignUp,
  CreateOrUpdateListing,
  Missing,
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
        <Route path="/logout" element={<Logout />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="/listing/:listingId" element={<CreateOrUpdateListing />} />
        <Route path="*" element={<Missing />} />
      </Routes>
    </div>
  );
}
