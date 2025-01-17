import axios from "axios";
import { useLoader } from "@/context/LoaderContext"; // Use this only within your components

// Base configuration for Axios
const config = {
  baseURL: import.meta.env.VITE_URL,
  timeout: 25000,
  headers: {
    "Content-Type": "application/json",
  },
};

// Helper function to get the Bearer token from localStorage
const getAuthToken = () => {
  return localStorage.getItem("token"); // Replace "authToken" with the key you use
};

// Loaderless API service instance
export const ApiServiceLoaderless = axios.create(config);

// Loader-enabled API service instance
const ApiServiceWithLoader = axios.create(config);

// Request interceptor for loader-enabled service
ApiServiceWithLoader.interceptors.request.use(
  async (config) => {
    const token = getAuthToken(); // Fetch token from localStorage
    if (token) {
      console.log("Attached token");
      
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    config.loader = true; // Custom flag to trigger loader outside
    return config;
  },
  (error) => {
    console.error("Error in request:", error.message);
    return Promise.reject(error);
  }
);

// Request interceptor for loaderless service
ApiServiceLoaderless.interceptors.request.use(
  async (config) => {
    const token = getAuthToken(); // Fetch token from localStorage
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Error in request:", error.message);
    return Promise.reject(error);
  }
);

// Response interceptor for loader-enabled service
ApiServiceWithLoader.interceptors.response.use(
  async (response) => {
    console.log("Loader stopped");
    return response;
  },
  async (error) => {
    console.error("Error in response:", error.message);
    return Promise.reject(error);
  }
);

// Generic function for API calls
export const fetchHandler = async (url, data, loader, setLoader, method) => {
  const service = loader ? ApiServiceWithLoader : ApiServiceLoaderless;
  console.log(url, data, loader, setLoader, method);
  

  try {
    if (loader) {
      setLoader(true); // Show loader
    }

    // Dynamically call the HTTP method (POST, GET, PUT, DELETE, etc.)
    const response = await service[method.toLowerCase()](
      url,
      method.toLowerCase() === "get" ||       method.toLowerCase() === "delete" 
        ? { params: data } // Use params for GET and DELETE requests
        : data // Use body for POST, PUT, etc.
    );

    if (loader) {
      setLoader(false); // Hide loader after response
    }

    return response;
  } catch (error) {
    console.error("Error in API request:", error.message);

    if (loader) {
      setLoader(false); // Hide loader after error
    }

    throw error;
  }
};

export default ApiServiceWithLoader;




// import axios from "axios";
// import { useLoader } from "@/context/LoaderContext"; // Use this only within your components

// // Base configuration for Axios
// const config = {
//   baseURL: import.meta.env.VITE_URL,
//   timeout: 25000,
//   headers: {
//     "Content-Type": "application/json",
//   },
// };

// // Loaderless API service instance
// export const ApiServiceLoaderless = axios.create(config);

// // Loader-enabled API service instance
// const ApiServiceWithLoader = axios.create(config);

// // Request interceptor for loader-enabled service
// ApiServiceWithLoader.interceptors.request.use(
//   async (config) => {
//     // Pass loader control in context
//     config.loader = true; // Custom flag to trigger loader outside
//     return config;
//   },
//   (error) => {
//     console.error("Error in request:", error.message);
//     return Promise.reject(error);
//   }
// );

// // Response interceptor for loader-enabled service
// ApiServiceWithLoader.interceptors.response.use(
//   async (response) => {
//     // Trigger loader stop logic here if needed
//     console.log("Loader stopped");
//     return response;
//   },
//   async (error) => {
//     console.error("Error in response:", error.message);
//     return Promise.reject(error);
//   }
// );

// // Generic function for API calls
// export const fetchHandler = async (url, data, loader, setLoader,method) => {



//   const service = loader ? ApiServiceWithLoader : ApiServiceLoaderless;

//   try {
//     if (loader) {
//       setLoader(true); // Show loader
//     }

//     // const response = await service.post(method,url, data);
//     // const response = await service.post(
//     //   // method, // Dynamic HTTP method
//     //   url,
//     //   data, // Data to send (for POST, PUT, etc.)
//     // );
//         // Dynamically call the HTTP method (POST, GET, PUT, DELETE, etc.)
//         const response = await service[method.toLowerCase()](
//           url,
//           data // Data to send (for POST, PUT, etc.)
//         );

//     if (loader) {
//       setLoader(false); // Hide loader after response
//     }

//     return response
//   } catch (error) {
//     console.error("Error in API request:", error.message);
    
//     if (loader) {
//       setLoader(false); // Hide loader after error
//     }

//     throw error;
//   }
// };

// export default ApiServiceWithLoader;



// usage
// import { fetchHandler } from "./api";

// // With loader
// fetchHandler("/endpoint", { key: "value" }).then((data) =>
//   console.log("Data with loader:", data)
// );

// // Without loader
// fetchHandler("/endpoint", { key: "value" }, false).then((data) =>
//   console.log("Data without loader:", data)
// );
