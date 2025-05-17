import { useEffect, useState } from "react";
import Image from "next/image";
import QAChecklist from "../QAChecklist/QAChecklist";

function CVPreview({
  cvData,
  Details,
  studentId,
  supervisorId,
  rollNumber,
  type,
}) {
  const [cvUrl, setCvUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [alreadyApproved, setAlreadyApproved] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const checkApprovalStatus = async () => {
      try {
        // Check supervisor approval status
        const res = await fetch(
          `/api/Status/QaCvSubmitStatus?rollNumber=${rollNumber}`
        );
        const data = await res.json();

        if (res.ok) {
          setShowContent(data.showContent);

          // Only check QA checklist if supervisor has approved
          if (data.showContent) {
            const checklistRes = await fetch(
              `/api/Checklist/GetChecklistStatus?rollNumber=${rollNumber}&type=${type}`
            );
            const checklistData = await checklistRes.json();
            setAlreadyApproved(checklistData?.rejectedPoints?.length === 0);
          }
        }
      } catch (error) {
        console.error("Error checking approval status:", error);
      }
    };

    checkApprovalStatus();
  }, [rollNumber, type]);

  useEffect(() => {
    if (cvData) {
      if (cvData.cvFilePath) {
        const correctedPath = cvData.cvFilePath.startsWith("public/")
          ? cvData.cvFilePath.replace("public", "")
          : cvData.cvFilePath;

        const finalUrl = correctedPath.startsWith("/")
          ? correctedPath
          : `/${correctedPath}`;
        setCvUrl(finalUrl);
      }
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [cvData]);

  return (
    <div>
      <h2 className="font-extrabold text-base text-[#0069D9] text-center p-4">
        CV PREVIEW
      </h2>

      {isLoading ? (
        <p className="text-gray-500 text-center">Loading...</p>
      ) : showContent && cvUrl ? (
        <div className="flex justify-between items-start">
          <div className="flex-1 flex justify-center">
            <Image
              src={cvUrl}
              alt="CV"
              width={400}
              height={400}
              className="shadow-md"
            />
          </div>
          <div className="flex-2">
            <QAChecklist
              type={type}
              Details={Details}
              studentId={studentId}
              supervisorId={supervisorId}
              rollNumber={rollNumber}
              alreadyApproved={alreadyApproved}
            />
          </div>
        </div>
      ) : (
        <div className="fixed  inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="">
              <iframe
                src="https://lottie.host/embed/0b07dc83-ff2e-48ef-a6d7-fd9ef80ee558/OI4XmEWxva.lottie"
                className="w-[300px] h-[300px] opacity-0 animate-fade-in mx-auto"
              ></iframe>
            </div>
            <div>
              <p className="text-red-500 text-base font-bold capitalize">
                {showContent
                  ? "No CV uploaded"
                  : "CV not approved by supervisor yet"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CVPreview;
