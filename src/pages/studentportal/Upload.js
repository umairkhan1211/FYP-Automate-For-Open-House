import { useRouter } from 'next/router';
import Layout from '../../components/layouts/Layout';
import React from 'react';
import CVUpload from '../../components/StudentUpload/CVUpload';
import FYPUpload from '../../components/StudentUpload/FYPUpload';
import VideoUpload from '../../components/StudentUpload/VideoUpload';
import jwt from 'jsonwebtoken';

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

  try {
    const userData = jwt.decode(token);
    if (!userData) throw new Error("Failed to decode token");
    
    const userId = userData.id;
    const rollNumber = userData.rollNumber;

    // Check FYP Status
    const fypResponse = await fetch(`http://localhost:3000/api/UploadFile/CheckFypStatus?userId=${userId}`);
    if (!fypResponse.ok) throw new Error(`Failed to fetch FYP status`);
    const fypData = await fypResponse.json();

    // Check Video/Banner Status
    const videoResponse = await fetch(`http://localhost:3000/api/UploadFile/CheckVideoStatus?userId=${userId}`);
    if (!videoResponse.ok) throw new Error(`Failed to fetch video status`);
    const videoData = await videoResponse.json();

    return {
      props: { 
        token, 
        userId, 
        rollNumber, 
        isFypUploaded: fypData.isFypUploaded || false,
        videoUrlExists: videoData.videoUrlExists || false,
        bannerImageExists: videoData.bannerImageExists || false,
        projectTitle: fypData.projectTitle || videoData.projectTitle || null
      },
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
}

export default function Upload({ 
  token, 
  userId, 
  rollNumber, 
  isFypUploaded, 
  videoUrlExists, 
  bannerImageExists,
  projectTitle 
}) {
  const router = useRouter();
  const { type } = router.query;

  const renderUploadComponent = () => {
    if (!type) return null;
    
    switch (type.toLowerCase()) {
      case 'cv':
        return <CVUpload userId={userId} rollNumber={rollNumber} />;
      case 'fyp':
        return <FYPUpload 
          userId={userId} 
          rollNumber={rollNumber} 
          projectTitle={projectTitle} 
          isFypUploaded={isFypUploaded} 
        />;
      case 'video':
        return <VideoUpload 
          userId={userId} 
          rollNumber={rollNumber} 
          videoUrlExists={videoUrlExists} 
          bannerImageExists={bannerImageExists} 
        />;
      default:
        return null;
    }
  };

  return (
    <Layout token={token}>
      {renderUploadComponent()}
    </Layout>
  );
}