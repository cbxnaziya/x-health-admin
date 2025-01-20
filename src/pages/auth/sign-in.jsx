// import React from "react";
// import {
//   Card,
//   Input,
//   Button,
//   Typography,
// } from "@material-tailwind/react";
// import { Link, useNavigate } from "react-router-dom";
// import { useForm } from "react-hook-form";
// // import { fetchHandler } from "@/Api"; // Import the fetchHandler
// import { signInValidationRules } from "@/schema"; // Import validation rules
// import { fetchHandler } from "@/utils/Api";
// import { SIGN_IN } from "@/utils/Endpoint";
// import { useLoader } from "@/context/LoaderContext";
// import toast, { Toaster } from "react-hot-toast";

// export function SignIn() {
//   const { setLoader } = useLoader(); // Get setLoader from context
//   const navigate = useNavigate()
//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm();

//   const onSubmit = async (data) => {


//     try {
//       const response = await fetchHandler(SIGN_IN, data, true, setLoader, "POST"); // Use fetchHandler with loader
//       console.log("Sign-in successful", response);
//           // Show success toast
//           toast.success(response.data.message);
//           navigate('/home')
//       reset(); 
//       // Handle success, e.g., navigate to a dashboard
//     } catch (error) {
//       console.log("Error:",error);
      
//         // Optionally show error toast
//         toast.error(error.response.data.message);
//       console.error("Error signing in:", error.message);
//     }
//   };

//   return (
//     <section className="min-h-screen flex items-center justify-center bg-gray-100">
//         <Toaster />
//       <div className="w-full max-w-md">
//         <div className="text-center">
//           {/* Company Logo */}
//           <img 
//             src="/img/logo.png" 
//             alt="Company Logo" 
//             className="mx-auto mb-6 w-24 h-auto"
//           />
//           <Typography variant="h2" className="font-bold mb-4">
//             Sign In
//           </Typography>
//         </div>
//         <form
//           onSubmit={handleSubmit(onSubmit)}
//           className="mt-8 mb-2 mx-auto w-full max-w-lg p-4"
//         >
//           <div className="mb-1 flex flex-col gap-3">
//             {/* Email Field */}
//             <Typography
//               variant="small"
//               color="blue-gray"
//               className="-mb-3 font-medium"
//             >
//               Your email
//             </Typography>
//             <Input
//               size="lg"
//               placeholder="name@mail.com"
//               className={`!border-t-blue-gray-200 focus:!border-t-gray-900 ${
//                 errors.email ? "border-red-500" : ""
//               }`}
//               {...register("email", signInValidationRules.email)}
//             />
//             {errors.email && (
//               <Typography variant="small" color="red" className="mt-1">
//                 {errors.email.message}
//               </Typography>
//             )}

//             {/* Password Field */}
//             <Typography
//               variant="small"
//               color="blue-gray"
//               className="-mb-3 font-medium"
//             >
//               Password
//             </Typography>
//             <Input
//               type="password"
//               size="lg"
//               placeholder="********"
//               className={`!border-t-blue-gray-200 focus:!border-t-gray-900 ${
//                 errors.password ? "border-red-500" : ""
//               }`}
//               {...register("password", signInValidationRules.password)}
//             />
//             {errors.password && (
//               <Typography variant="small" color="red" className="mt-1">
//                 {errors.password.message}
//               </Typography>
//             )}
//           </div>

//           <Button type="submit" className="mt-6" fullWidth>
//             Sign In
//           </Button>

//           <div className="flex items-center justify-between gap-2 mt-6">
//             <Typography variant="small" className="font-medium text-gray-900">
//               <a href="#">Forgot Password ?</a>
//             </Typography>
//           </div>

//           <Typography
//             variant="paragraph"
//             className="text-center text-blue-gray-500 font-medium mt-4"
//           >
//             Not registered?
//             <Link to="/auth/sign-up" className="text-gray-900 ml-1">
//               Create account
//             </Link>
//           </Typography>
//         </form>
//       </div>
//     </section>
//   );
// }

// export default SignIn;

import React, { useEffect, useState } from "react";
import {
  Card,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid"; // Import UUID library
import { fetchHandler } from "@/utils/Api";
import { SIGN_IN } from "@/utils/Endpoint";
import { useLoader } from "@/context/LoaderContext";
import toast, { Toaster } from "react-hot-toast";
// Import Firebase
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import { signInValidationRules } from "@/schema";

// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

export function SignIn() {
  const { setLoader } = useLoader();             
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  
  const [deviceId, setDeviceId] = useState("");
  const [deviceToken, setDeviceToken] = useState("");

  // Initialize Firebase and get the device token
  useEffect(() => {
    const app = initializeApp(firebaseConfig);
    const messaging = getMessaging(app);

    // Generate device ID
    const id = localStorage.getItem("device_id") || uuidv4();
    setDeviceId(id);
    localStorage.setItem("device_id", id); // Save to localStorage to persist across sessions

    // Get device token for notifications
    getToken(messaging, { vapidKey: "YOUR_VAPID_KEY" })
      .then((token) => {
        setDeviceToken(token);
        console.log("Device Token:", token);
      })
      .catch((err) => {
        console.error("Error getting device token:", err);
      });
  }, []);

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        deviceId,
        deviceToken,
      };

      const response = await fetchHandler(SIGN_IN, payload, true, setLoader, "POST");
      console.log("Sign-in successful", response);
      toast.success(response.data.message);
    localStorage.setItem("token", response.data.token); // Save to localStorage to persist across sessions
      navigate("/home");
      reset();
    } catch (error) {
      console.error("Error signing in:", error);
      toast.error(error.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100">
      <Toaster />
      <div className="w-full max-w-md">
        <div className="text-center">
          <img src="/img/logo.png" alt="Company Logo" className="mx-auto mb-6 w-24 h-auto" />
          <Typography variant="h3" className="font-bold mb-4">
            Sign In
          </Typography>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 mb-2 mx-auto w-full max-w-lg p-4"
        >
          <div className="mb-1 flex flex-col gap-3">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Your email
            </Typography>
            <Input
              size="lg"
              placeholder="name@mail.com"
              className={`!border-t-blue-gray-200 focus:!border-t-gray-900 ${errors.email ? "border-red-500" : ""}`}
              {...register("email", signInValidationRules.email)}
            />
            {errors.email && (
              <Typography variant="small" color="red" className="mt-1">
                {errors.email.message}
              </Typography>
            )}

            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Password
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="********"
              className={`!border-t-blue-gray-200 focus:!border-t-gray-900 ${errors.password ? "border-red-500" : ""}`}
              {...register("password", signInValidationRules.password)}
            />
            {errors.password && (
              <Typography variant="small" color="red" className="mt-1">
                {errors.password.message}
              </Typography>
            )}
          </div>

          <Button type="submit" className="mt-6" fullWidth>
            Sign In
          </Button>

          {/* <div className="flex items-center justify-between gap-2 mt-6">
            <Typography variant="small" className="font-medium text-gray-900">
              <a href="#">Forgot Password ?</a>
            </Typography>
          </div> */}

          {/* <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
            Not registered?
            <Link to="/auth/sign-up" className="text-gray-900 ml-1">
              Create account
            </Link>
          </Typography> */}
        </form>
      </div>
    </section>
  );
}

export default SignIn;
