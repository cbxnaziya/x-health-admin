import React from "react";
import { useLoader } from "@/context/LoaderContext"; // Assuming you have the loader context

const GlobalLoader = () => {
  const { isLoading } = useLoader();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-16 h-16 border-4 border-t-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default GlobalLoader;
