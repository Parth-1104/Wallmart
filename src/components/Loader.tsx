import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ React Router
import { MultiStepLoader as Loader } from "./ui/MultistepLoader";
import { IconSquareRoundedX } from "@tabler/icons-react";

const loadingStates = [
  { text: "Upload your shopping List" },
  { text: "Smartly navigate to items" },
  { text: "Never miss the offers" },
  { text: "Scan through Phone" },
  { text: "Quick checkout" },
];

export function MultiStepLoaderDemo() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // ✅ React Router hook

  // Navigate after loading is complete
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (loading) {
      timeout = setTimeout(() => {
        navigate("/home");
      }, loadingStates.length * 350); // duration × steps
    }
    return () => clearTimeout(timeout);
  }, [loading, navigate]);

  const handleClose = () => {
    setLoading(false);
    navigate("/home"); // Immediate redirect
  };

  return (
    <div className="w-full h-[60vh] flex items-center justify-center">
      <Loader loadingStates={loadingStates} loading={loading} duration={420} />

      <button
        onClick={() => setLoading(true)}
        className="bg-[#00e676] hover:bg-[#39C3EF]/90 text-black mx-auto transition duration-200 
                   h-16 px-10 rounded-lg flex items-center justify-center 
                   text-xl md:text-2xl font-semibold shadow-md"
        style={{
          boxShadow:
            "0px -1px 0px 0px #ffffff40 inset, 0px 1px 0px 0px #ffffff40 inset",
        }}
      >
        Explore
      </button>

      {loading && (
        <button
          className="fixed top-4 right-4 text-black dark:text-white z-[120]"
          onClick={handleClose}
        >
          <IconSquareRoundedX className="h-10 w-10" />
        </button>
      )}
    </div>
  );
}
