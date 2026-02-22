import api from "../api/api";
import { loginUser as loginUserAction } from "../store/User"; // ✅ Alias the import
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors([]);
    setSuccess("");

    const form = new FormData(e.currentTarget);
    const email = form.get("email");
    const password = form.get("password");

    // ✅ Frontend validation
    if (!email || !password) {
      setErrors(["Email and Password are required"]);
      return;
    }

    try {
      setLoading(true);

      // ✅ Uses the standard 'api' instance with 'withCredentials: true'
      const res = await api.post("/user/login", { email, password });

      if (res.data.success) {
        setSuccess("✅ Login Successful! Redirecting...");
        
        // 1. Store the new access token
        localStorage.setItem("accessToken", res.data.accessToken);
        
        // 2. Dispatch the Redux action using the aliased name
        // Use res.data.user because your backend returns the user object there
        dispatch(loginUserAction(res.data.user));

        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    } catch (err) {
      console.error("Login Error:", err.response?.data);

      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else if (err.response?.data?.msg) {
        setErrors([err.response.data.msg]);
      } else {
        setErrors(["Something went wrong. Please try again."]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login to Your Account
        </h2>

        {errors.length > 0 && (
          <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded mb-4">
            <ul className="list-disc list-inside text-sm">
              {errors.map((errMsg, index) => (
                <li key={index}>{errMsg}</li>
              ))}
            </ul>
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 p-3 rounded mb-4 text-sm">
            {success}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-6">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
