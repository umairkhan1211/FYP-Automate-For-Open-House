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
    console.error("No token found, redirecting to login.");
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  let userId, rollNumber;
  try {
    const userData = jwt.decode(token);
    console.log(userData)
    if (!userData) {
      throw new Error("Failed to decode token");
    }
    userId = userData.id;
    rollNumber = userData.rollNumber;
  } catch (error) {
    console.error("Token decoding failed:", error);
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  try {
    const response = await fetch(`http://localhost:3000/api/UploadFile/CheckFypStatus?userId=${userId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch upload status: ${response.statusText}`);
    }

    const { isFypUploaded, projectTitle } = await response.json();

    // Handle case where projectTitle is undefined
    return {
      props: { token, userId, rollNumber, isFypUploaded, projectTitle: projectTitle || null },  // Default projectTitle to null
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
}


export default function Upload({ token, userId, rollNumber, isFypUploaded, projectTitle }) {
  const router = useRouter();
  const { type } = router.query;

  const renderUploadComponent = () => {
    switch (type) {
      case 'cv':
        return <CVUpload userId={userId} rollNumber={rollNumber} />;
      case 'fyp':
        return <FYPUpload userId={userId} rollNumber={rollNumber} projectTitle={projectTitle} isFypUploaded={isFypUploaded} />;
      case 'video':
        return <VideoUpload userId={userId} rollNumber={rollNumber} />;
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
