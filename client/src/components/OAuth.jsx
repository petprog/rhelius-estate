import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signInSuccess } from "../redux/user/userSlice";
import { useGoogleMutation } from "../features/auth/authApiSlice";

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [google] = useGoogleMutation();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      const { displayName, email, photoURL } = result.user;
      console.log({ displayName, email, photoURL });
      const data = await google({
        name: displayName,
        email,
        photo: photoURL,
      }).unwrap();
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (err) {
      console.log("could not sign in with google", err);
    }
  };
  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95 "
    >
      Continue With Google
    </button>
  );
}
