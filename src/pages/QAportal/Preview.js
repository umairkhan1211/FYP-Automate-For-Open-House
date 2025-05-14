import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import axios from "axios";
import jwt from "jsonwebtoken";
import Layout from "../../components/layouts/Layout";
import CVPreview from "../../components/QApreview/CVPreview";
import FYPPreview from "../../components/QApreview/FYPPreview";
import VideoPreview from "../../components/QApreview/VideoPreview";

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

  const chk = jwt.decode(token);
  const Details = {
    userId: chk?.id,
    userName: chk?.name,
    userRole: chk?.role,
  };

  return {
    props: { token, Details },
  };
}

export default function Preview({ token, Details }) {

  
  const router = useRouter();

  const { type, rollNumber, studentId, supervisorId } = router.query;
  const [cvData, setCvData] = useState(null);
  const [fypPreviewData, setFypPreviewData] = useState([]);
  const [videoPreviewData, setVideoPreviewData] = useState([]);
  const [projectTitle, setProjectTitle] = useState("");
  const [supervisorIdState, setSupervisorIdState] = useState("");
  const [userRole, setuserRole] = useState("");

  console.log("fyppreview data ma kya ha",fypPreviewData)

 useEffect(() => {
  if (Details?.userRole) {
    setuserRole(Details.userRole);
    console.log("Set userRole:", Details.userRole);
  }

  const storedData = sessionStorage.getItem("previewData");
  console.log("storeddata dekho".storedData)
  if (storedData) {
    const data = JSON.parse(storedData);
    setProjectTitle(data.projectTitle || "");
    setSupervisorIdState(data.supervisorId || "");

    if (type === "fyp" && data.fypPreviewData) {
      setFypPreviewData(data.fypPreviewData);
    }

    if (type === "video" && data.videoPreviewData) {
      setVideoPreviewData(data.videoPreviewData);
    }
  }

  if (type === "cv" && rollNumber) {
    axios
      .get(`/api/FetchRecords/GetCv?rollNumber=${rollNumber}`)
      .then((response) => {
        setCvData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching CV data:", error);
      });
  }
}, [type, rollNumber, Details]);


  const renderUploadComponent = () => {
    switch (type) {
      case "cv":
        return (
          <CVPreview
            cvData={cvData}
            Details={Details}
            studentId={studentId}
            supervisorId={supervisorId}
            rollNumber={rollNumber}
          />
        );
      case "fyp":
        return (
          <FYPPreview
            data={fypPreviewData}
            projectTitle={projectTitle}
            supervisorId={supervisorIdState}
            userRole={userRole}
            
          />
        );
      case "video":
        return (
          <VideoPreview
            data={videoPreviewData}
            projectTitle={projectTitle}
            supervisorId={supervisorIdState}
            userRole={userRole}
          />
        );
      default:
        return null;
    }
  };

  return <Layout token={token}>{renderUploadComponent()}</Layout>;
}
