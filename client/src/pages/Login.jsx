import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import TextBox from "../components/TextBox";
import Button from "../components/Button";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../redux/slices/api/authApiSlice.js";
import { toast } from "sonner";
import { setCredentials } from "../redux/slices/authSlice.js";
import Loading from "../components/Loader.jsx";

function Login() {
  const { user } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  const submitHandler = async (data) => {
    try {
      const result = await login(data).unwrap();
      dispatch(setCredentials(result));
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || error.message);
    }
  };

  useEffect(() => {
    user && navigate("/dashboard");
  }, [user]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center flex-col lg:flex-row bg-[#f3f4f6]">
      <div className="w-full md:w-auto flex gap-0 md:gap-40 flex-col md:flex-row items-center justify-center">
        {/* left part of the page */}
        <div className="h-full w-full lg:w-2/3 flex flex-col items-center justify-center">
          <div className="w-full md:max-w-lg 2xl:max-w-3xl flex flex-col items-center justify-center gap-5 md:gap-y-10 2xl:-mt-20">
            <p className="flex flex-col gap-0 md:gap-4 text-4xl md:text-6xl 2xl:text-7xl font-black text-clip text-cyan-500">
              <span>Tasker</span>
            </p>
            <span className="flex gap-1 py-1 px-3 -mt-3 border rounded-full text-sm md:text-base border-gray-300 text-gray-600">
              Schedule and Manage all your projects
            </span>

            <div className="cell mt-3">
              <div className="diamond pulse-glow"></div>
            </div>
          </div>
        </div>
        {/* right part of the page */}
        <div className="w-full md:w-1/3 p-4 md:p-1 flex flex-col items-center justify-center">
          <form
            onSubmit={handleSubmit(submitHandler)}
            className="form-container w-full md:w-[400px] flex flex-col gap-y-8 bg-white px-10 pt-14 pb-14"
          >
            <div className="">
              <p className="text-blue-600 text-3xl font-bold text-center">
                Hola Amigo!
              </p>
              <p className="text-center text-base text-gray-700">
                Welcome back to your personalized space.
              </p>
            </div>
            <div className="flex flex-col gap-y-5">
              <TextBox
                placeholder="youremail@domain.com"
                type="email"
                name="email"
                label="Email Address"
                className="w-full rounded-full"
                register={register("email", {
                  required: "Email is required",
                })}
                error={errors.email ? errors.email.message : ""}
              />
              <TextBox
                placeholder="password"
                type="password"
                name="password"
                label="Password"
                className="w-full rounded-full"
                register={register("password", {
                  required: "Password is required",
                })}
                error={errors.password ? errors.password.message : ""}
              />
              <span className="text-sm text-gray-500 hover:text-blue-600 hoverrr:underline cursor-pointer">
                Forgot Password?
              </span>
              {isLoading ? (
                <Loading />
              ) : (
                <Button
                  type="submit"
                  label="Submit"
                  className="w-full h-10 bg-blue-700 text-white rounded-full"
                />
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
