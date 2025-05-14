import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CVPreview() {
  const [cvFilePath, setCvFilePath] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;

      try {
        const response = await fetch(`/api/UploadFile/GetUploadedCv?userId=${userId}`);
        const data = await response.json();

        if (response.ok) {
          const correctedPath = data.cvFilePath?.startsWith("public/")
            ? data.cvFilePath.replace("public", "")
            : data.cvFilePath;

          // You might need to ensure the path starts with '/' to work properly
          const finalPath = correctedPath?.startsWith("/") ? correctedPath : `/${correctedPath}`;

          setCvFilePath(finalPath);
        } else {
          console.error("Error fetching CV:", data.message);
        }
      } catch (error) {
        console.error("Error fetching CV:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  return (
    <div>
      <h2 className="font-extrabold text-base text-[#0069D9] text-center p-4">CV PREVIEW</h2>
      <div className="flex flex-col items-center justify-center h-full pb-10">
        {isLoading ? (
          <p className="text-gray-500">Loading...</p>
        ) : cvFilePath ? (
          <Image
            src={cvFilePath}
            width={450}
            height={450}
            alt="Uploaded CV"
            className="shadow-md"
          />
        ) : (
          <p className="text-red-500 text-center">No CV uploaded.</p>
        )}
        <Link href="/studentportal">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-300 mt-4">
            Back
          </button>
        </Link>
      </div>
    </div>
  );
}
