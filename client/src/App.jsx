import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  Home,
  About,
  Login,
  Logout,
  Profile,
  SignUp,
  CreateListing,
} from "./pages";
import { Header, PrivateRoute } from "./components";

export default function App() {
  return (
    <BrowserRouter>
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
        <Route path="/create-listing" element={<CreateListing />} />
      </Routes>
    </BrowserRouter>
  );
}
