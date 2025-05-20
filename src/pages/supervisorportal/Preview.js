import Layout from "../../components/layouts/Layout";
import CVPreview from "../../components/SpervisorPreview/CVPreview";
import FYPPreview from "../../components/SpervisorPreview/FYPPreview";
import VideoPreview from "../../components/SpervisorPreview/VideoPreview";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import axios from "axios";

export async function getServerSideProps({ req }) {
  const token = req.cookies.token;
  if (!token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: { token },
  };
}

export default function Preview({ token }) {
  const router = useRouter();
  const { rollNumber: queryRollNumber, studentId: queryStudentId, type: queryType , supervisorId:querySupervisorId , supervisorRole:querysupervisorRole  } = router.query;


  const [type, setType] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [fypDocument, setFypDocument] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [supervisorId, setSupervisorId] = useState("");
  const [supervisorRole, setSupervisorRole] = useState("");
  const [studentIds, setStudentIds] = useState([]);
  const [cvFilePath, setCvFilePath] = useState("");

  const [studentIdOnly, setStudentIdOnly] = useState("");
  const [rollNumberOnly, setRollNumberOnly] = useState("");

useEffect(() => {
  const updatedData = sessionStorage.getItem("previewData");
  if (updatedData) {
    const parsed = JSON.parse(updatedData);

    // Check for FYP type
    if (parsed.type === "fyp" && parsed.fypPreviewData?.length > 0) {
      const fypData = parsed.fypPreviewData[0];
      if (!fypData.fypDocument) {
        setFypDocument("");
      }
    }

    // Check for Video type
    if (parsed.type === "video" && parsed.videoPreviewData?.length > 0) {
      const videoData = parsed.videoPreviewData[0];

      // If videoUrl is null or empty, reflect it
      if (!videoData.videoUrl) {
        setVideoUrl(null); // or ""
      } else {
        setVideoUrl(videoData.videoUrl);
      }

      // If bannerImage is null or empty, reflect it
      if (!videoData.bannerImage) {
        setBannerImage(null); // or ""
      } else {
        setBannerImage(videoData.bannerImage);
      }
    }
  }
}, []);


// Load preview data from sessionStorage
useEffect(() => {
  const storedData = sessionStorage.getItem("previewData");

  if (queryType) {
    setType(queryType);
  }

  if (storedData) {
    const parsed = JSON.parse(storedData);

    setProjectTitle(parsed.projectTitle || "");

    if (parsed.supervisorId) {
      setSupervisorId(parsed.supervisorId);
    }

    if (parsed.supervisorRole) {
      setSupervisorRole(parsed.supervisorRole);
    }

    // Set student info
    if (parsed.studentIds && parsed.studentIds.length > 0) {
      setStudentIds(parsed.studentIds);
      const firstStudent = parsed.studentIds[0];
      setStudentIdOnly(firstStudent._id);
      setRollNumberOnly(firstStudent.rollNumber);
    }

    // Set type
    if (!queryType && parsed.type) {
      setType(parsed.type);
    }

    // Set FYP Document Path from preview data
    if (parsed.type === "fyp" && parsed.fypPreviewData && parsed.fypPreviewData.length > 0) {
      const fypData = parsed.fypPreviewData[0];
      setFypDocument(fypData.fypDocument || "");
    }

    // Extract videoUrl and bannerImage from videoPreviewData[0]
    if (parsed.type === "video" && parsed.videoPreviewData && parsed.videoPreviewData.length > 0) {
      const videoData = parsed.videoPreviewData[0];
      setVideoUrl(videoData.videoUrl || "");
      setBannerImage(videoData.bannerImage || "");
    }
  }
}, [queryType]);

  // Fetch CV if type is cv
  useEffect(() => {
    if (type === "cv" && queryRollNumber) {
      const fetchCV = async () => {
        try {
          const res = await axios.get(`/api/FetchRecords/GetCv?rollNumber=${queryRollNumber}`);
          setCvFilePath(res.data.cvFilePath);
        } catch (err) {
          console.error("Error fetching CV:", err);
        }
      };
      fetchCV();
    }
  }, [type, queryRollNumber]);

  const renderUploadComponent = () => {
    switch (type) {
      case "cv":
        return (
          <CVPreview
            rollNumber={queryRollNumber}
            studentId={queryStudentId}
            supervisorId={querySupervisorId}
            supervisorRole={querysupervisorRole}
            cvFilePath={cvFilePath}
          />
        );
      case "fyp":
        return (
          <FYPPreview
            rollNumber={rollNumberOnly}
            studentId={studentIdOnly}
            supervisorId={supervisorId}
            supervisorRole={supervisorRole}
            projectTitle={projectTitle}
            fypDocument={fypDocument}
          />
        );
      case "video":
        return (
          <VideoPreview
            rollNumber={rollNumberOnly}
            studentId={studentIdOnly}
            supervisorId={supervisorId}
            supervisorRole={supervisorRole}
            projectTitle={projectTitle}
            videoUrl={videoUrl}
            bannerImage={bannerImage}
          />
        );
      default:
        return <p className="text-center text-gray-500">No preview type selected</p>;
    }
  };

  return (
    <Layout token={token}>
      <div className="container mx-auto px-4 py-6">
        {renderUploadComponent()}
      </div>
    </Layout>
  );
}
