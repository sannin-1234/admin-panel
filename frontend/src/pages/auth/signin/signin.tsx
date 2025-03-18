import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSignin } from "../services";
import Cookies from "js-cookie";
import { USER_ACCESS_KEY } from "../../../utils/enum";
import { useUser } from "../../../context/user-context";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { setUser } = useUser();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const signin = useSignin();
  const navigate = useNavigate();

  const validateEmail = (email: any) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return "Email or phone no. is required";
    } else if (!emailRegex.test(email)) {
      return "Please enter a valid email address or phone no.";
    }
    return "";
  };

  // Password validation
  const validatePassword = (password: any) => {
    if (!password) {
      return "Password is required";
    } else if (password.length < 8) {
      return "Password must be at least 8 characters long";
    } else if (!/(?=.*[a-z])/.test(password)) {
      return "Password must contain at least one lowercase letter";
    } else if (!/(?=.*[A-Z])/.test(password)) {
      return "Password must contain at least one uppercase letter";
    } else if (!/(?=.*\d)/.test(password)) {
      return "Password must contain at least one number";
    } else if (!/(?=.*[!@#$%^&*])/.test(password)) {
      return "Password must contain at least one special character";
    }
    return "";
  };

  const handleChange = (e: any) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    // Real-time validation
    if (id === "email") {
      setErrors((prev) => ({
        ...prev,
        email: validateEmail(value),
      }));
    } else if (id === "password") {
      setErrors((prev) => ({
        ...prev,
        password: validatePassword(value),
      }));
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    setErrors({
      email: emailError,
      password: passwordError,
    });

    if (!emailError && !passwordError) {
      signin.mutate(formData);
    }
  };

  useEffect(() => {
    if (signin.isSuccess) {
      toast.success("Signin successful!");
      setFormData({ email: "", password: "" });
      Cookies.set(USER_ACCESS_KEY.TOKEN, signin.data?.user?.token, {
        secure: true,
        sameSite: "lax",
      });

      setUser({
        id: signin.data?.user?.id,
        email: signin.data?.user?.email,
        role: signin.data?.user?.role,
      });
      if ((signin.data?.user?.role).toLowerCase() === "client") {
        navigate(`/${signin.data?.user?.organizationId}`);
        Cookies.set(
          USER_ACCESS_KEY.ORGANIZATION_ID,
          signin.data?.user?.organizationId,
          {
            secure: true,
            sameSite: "lax",
          }
        );
      } else {
        navigate("/organization");
      }
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signin.isSuccess]);

  useEffect(() => {
    if (signin.isError) {
      toast.error("Something went wrong. Please try again.");
      console.log(signin.error);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signin.isError]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-mint via-white to-purple/20">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg m-4">
        <div className="text-center space-y-2">
          <h1 className="font-playfair text-4xl font-bold text-black">
            Welcome Back
          </h1>
          <p className="font-montserrat text-sm text-gray-500">
            Please enter your credentials to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block font-montserrat text-sm font-medium text-black"
            >
              Email or Phone no.
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email or phone no."
              className={`w-full h-12 px-3 py-2 bg-white border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm font-montserrat text-sm focus:outline-none focus:ring-2 focus:ring-purple focus:border-purple`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block font-montserrat text-sm font-medium text-black"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={`w-full h-12 px-3 py-2 bg-white border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm font-montserrat text-sm focus:outline-none focus:ring-2 focus:ring-purple focus:border-purple pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <span className="w-5 h-5 flex items-center justify-center">
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                </span>
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="font-montserrat text-sm text-terracotta hover:text-coral transition-colors float-end"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={signin.isLoading}
            className="w-full h-12 bg-terracotta hover:bg-coral text-white transition-colors font-montserrat font-medium rounded-md flex items-center justify-center"
          >
            {signin.isLoading ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <g
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  >
                    <path
                      stroke-dasharray="16"
                      stroke-dashoffset="16"
                      d="M12 3c4.97 0 9 4.03 9 9"
                    >
                      <animate
                        fill="freeze"
                        attributeName="stroke-dashoffset"
                        dur="0.3s"
                        values="16;0"
                      />
                      <animateTransform
                        attributeName="transform"
                        dur="1.5s"
                        repeatCount="indefinite"
                        type="rotate"
                        values="0 12 12;360 12 12"
                      />
                    </path>
                    <path
                      stroke-dasharray="64"
                      stroke-dashoffset="64"
                      stroke-opacity="0.3"
                      d="M12 3c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9c0 -4.97 4.03 -9 9 -9Z"
                    >
                      <animate
                        fill="freeze"
                        attributeName="stroke-dashoffset"
                        dur="1.2s"
                        values="64;0"
                      />
                    </path>
                  </g>
                </svg>
                <span className="ml-2">Signing In...</span>
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
