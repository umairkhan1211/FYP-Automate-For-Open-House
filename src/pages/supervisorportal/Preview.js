import Layout from '../../components/layouts/Layout';
import CVPreview from '../../components/SpervisorPreview/CVPreview';
import FYPPreview from '../../components/SpervisorPreview/FYPPreview';
import VideoPreview from '../../components/SpervisorPreview/VideoPreview';
import { useRouter } from 'next/router';
import React from 'react'


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

export default function Preview({token}) {
    const router = useRouter();
    const { type } = router.query;
  
    const renderUploadComponent = () => {
      switch (type) {
        case 'cv':
          return <CVPreview/>;
        case 'fyp':
          return <FYPPreview/>;
        case 'video':
          return <VideoPreview/>;
      }
    };
  
    return (
      <Layout token={token}>
        {renderUploadComponent()}
      </Layout>
    );
  }