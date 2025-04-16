import { useEffect, useState } from 'react';
import Layout from '../components/layouts/Layout';

import Loader from "../components/Loader/Loader";
import Login from '../components/login/Login';

function Index() {
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        // Simulate a delay for loading
        const timer = setTimeout(() => setLoading(false), 7300); // Adjust the delay as needed
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <Loader />; // Display loader while loading
    }

    return (
        <Layout>
            <div>
                <Login />
            </div>
        </Layout>
    );
}

export default Index;
