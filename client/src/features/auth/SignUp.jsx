import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toggleSignUpPassword } from "../../redux/password/passwordSlice";
import { useDispatch, useSelector } from "react-redux";
import OAuth from "../../components/OAuth";
import { useSignupMutation } from "./authApiSlice";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const { showSignUpPassword } = useSelector((state) => state.password);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [signup, { isLoading: loading }] = useSignupMutation();

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
      await signup({ ...formData }).unwrap();
      navigate("/login");
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
    dispatch(toggleSignUpPassword());
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold  mt-4 mb-7">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg w-full  border-gray-300 outline-none focus:border-slate-700  focus:border-x-2 focus:border-y-2 "
          id="username"
          required
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg w-full  border-gray-300 outline-none
          focus:border-x-2 focus:border-y-2 focus:border-slate-700"
          id="email"
          required
          onChange={handleChange}
        />
        <div className="relative">
          <input
            type={showSignUpPassword ? "text" : "password"}
            placeholder="password"
            className="border p-3 rounded-lg w-full  border-gray-300 outline-none focus:border-slate-700  focus:border-x-2 focus:border-y-2 "
            id="password"
            required
            onChange={handleChange}
          />
          <button
            className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-600"
            onClick={togglePasswordVisibility}
          >
            {showSignUpPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-70"
        >
          {loading ? "Loading..." : "Sign up"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-3 justify-center">
        <p>Already have an account?</p>
        <Link to="/login">
          <span className="text-blue-700">Sign in</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
}
