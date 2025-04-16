import React from "react";
import { useRouter } from "next/router";
import Layout from "../../components/layouts/Layout";
import CVPreview from "../../components/QApreview/CVPreview";
import FYPPreview from "../../components/QApreview/FYPPreview";
import VideoPreview from "../../components/QApreview/VideoPreview";

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

export default function Preview({ token }) {
  const router = useRouter();
  const { type } = router.query;

  const renderUploadComponent = () => {
    switch (type) {
      case "cv":
        return <CVPreview />;
      case "fyp":
        return <FYPPreview />;
      case "video":
        return <VideoPreview />;
    }
  };

  return(

    <Layout token={token}>
    {renderUploadComponent()
    }</Layout>
  )
}
