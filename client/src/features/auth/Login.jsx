import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { signInSuccess } from "../../redux/user/userSlice";
import { toggleLoginPassword } from "../../redux/password/passwordSlice";
import OAuth from "../../components/OAuth";
import { useLoginMutation } from "./authApiSlice";

export default function Login() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const { showLoginPassword } = useSelector((state) => state.password);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading: loading }] = useLoginMutation();

  useEffect(() => {
    setError("");
  }, [formData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login({ ...formData }).unwrap();
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (err) {
      if (!err.status) {
        setError("No Server Response");
      } else if (err.status === 400) {
        setError("email and password required");
      } else if (err.status === 401) {
        setError("Unauthorized");
      } else {
        setError(err.data?.message);
      }
    }
  };

  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    dispatch(toggleLoginPassword());
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold mt-4 mb-7">Login</h1>
      <form action="" onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg w-full  border-gray-300 outline-none focus:border-slate-700  focus:border-x-2 focus:border-y-2 "
          id="email"
          onChange={handleChange}
          required
        />
        <div className="relative">
          <input
            type={showLoginPassword ? "text" : "password"}
            placeholder="password"
            className="border p-3 rounded-lg w-full  border-gray-300 outline-none focus:border-slate-700  focus:border-x-2 focus:border-y-2 "
            id="password"
            onChange={handleChange}
            required
          />
          <button
            className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-600"
            onClick={togglePasswordVisibility}
          >
            {showLoginPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-70"
        >
          {loading ? "Loading..." : "Login"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-3 justify-center">
        <p>Don&apos;t no account yet?</p>
        <Link to="/signup">
          <span className="text-blue-700">Sign Up</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
}
