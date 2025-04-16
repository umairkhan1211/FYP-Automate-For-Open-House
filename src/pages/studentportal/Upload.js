import { useRouter } from 'next/router';
import Layout from '../../components/layouts/Layout';
import React from 'react';
import CVUpload from '../../components/StudentUpload/CVUpload';
import FYPUpload from '../../components/StudentUpload/FYPUpload';
import VideoUpload from '../../components/StudentUpload/VideoUpload';

export async function getServerSideProps({ req }) {
  const token = req.cookies.token;

  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: { token }, // Pass the token to the page as a prop
  };
}

export default function Upload({ token }) {
  const router = useRouter();
  const { type } = router.query;

  const renderUploadComponent = () => {
    switch (type) {
      case 'cv':
        return <CVUpload/>;
      case 'fyp':
        return <FYPUpload/>;
      case 'video':
        return <VideoUpload/>;
    }
  };

  return (
    <Layout token={token}>
      {renderUploadComponent()}
    </Layout>
  );
}
