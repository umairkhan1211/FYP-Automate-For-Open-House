import { useEffect, useState } from "react";
import Image from "next/image";
import QAChecklist from "../QAChecklist/QAChecklist";

function CVPreview({ cvData, Details, studentId, supervisorId , rollNumber }) {
  const [cvUrl, setCvUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (cvData) {
      if (cvData.cvFilePath) {
        const correctedPath = cvData.cvFilePath.startsWith("public/")
          ? cvData.cvFilePath.replace("public", "")
          : cvData.cvFilePath;

        const finalUrl = correctedPath.startsWith("/") ? correctedPath : `/${correctedPath}`;
        setCvUrl(finalUrl);
      }
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [cvData]);

  return (
    <div>
      <h2 className="font-extrabold text-base text-[#0069D9] text-center p-4">CV PREVIEW</h2>

      {isLoading ? (
        <p className="text-gray-500 text-center">Loading...</p>
      ) : cvUrl ? (
        <div className="flex justify-between items-start ">
          <div className="flex-1 flex justify-center">
            <Image src={cvUrl} alt="CV" width={400} height={400} className="shadow-md" />
          </div>
          <div className="flex-2">
            <QAChecklist type="cv" Details={Details} studentId={studentId} supervisorId={supervisorId} rollNumber={rollNumber} />
          </div>
        </div>
      ) : (
        <p className="text-red-500 text-center">No CV uploaded</p>
      )}
    </div>
  );
}

export default CVPreview;
