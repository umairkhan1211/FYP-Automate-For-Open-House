import { useRouter } from 'next/router';
import Layout from '../../components/layouts/Layout';
import React from 'react';
import CVPreview from '../../components/StudentPreview/CVPreview';
import FYPPreview from '../../components/StudentPreview/FYPPreview';
import VideoPreview from '../../components/StudentPreview/VideoPreview';

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
            case 'cv':
                return <CVPreview />;
            case 'fyp':
                return <FYPPreview userId={localStorage.getItem("userId")} />; // Pass userId prop
            case 'video':
                return <VideoPreview userId={localStorage.getItem("userId")} />; // Pass userId prop
            default:
                return null; // Handle case where type is not recognized
        }
    };

    return (
        <Layout token={token}>
            {renderUploadComponent()}
        </Layout>
    );
}
