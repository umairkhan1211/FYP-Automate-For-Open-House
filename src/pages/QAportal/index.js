import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt from "jsonwebtoken";
import Link from "next/link";
import Layout from "../../components/layouts/Layout";
import QAupload from "../../components/QAupload/QAupload";




import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectCoverflow } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

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

  const decoded = jwt.decode(token);
  const department = decoded?.department || "";

  return {
    props: { token, department },
  };
}

export default function Index({ token, department }) {
  const [groups, setGroups] = useState({});
  const [showUpload, setShowUpload] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await axios.post("/api/FetchRecords/GetQaGroup", {
          department,
        });
        setGroups(res.data.groups || {});
      } catch (err) {
        console.error("Error fetching QA groups", err);
      }
    };
    fetchGroups();
  }, [department]);

  return (
    <Layout token={token}>
      <div className="pb-10 container mx-auto overflow-x-hidden">

        <div className="w-9/12 min-w-lg mx-auto p-6 space-x-2">
          <button
            onClick={() => setShowUpload(true)}
            className={`border-2 rounded-lg text-md font-semibold py-1 px-4 ${
              showUpload
                ? "bg-[#0069D9] text-white border-[#0069D9]"
                : "border-[#0069D9] text-[#0069D9] bg-white"
            }`}
          >
            Groups
          </button>
          <button
            onClick={() => setShowUpload(false)}
            className={`border-2 rounded-lg text-md font-semibold py-1 px-4 ${
              !showUpload
                ? "bg-[#0069D9] text-white border-[#0069D9]"
                : "border-[#0069D9] text-[#0069D9] bg-white"
            }`}
          >
            Upload
          </button>
        </div>

        {showUpload ? (
          <div className="px-8 py-8">
            <Swiper
              modules={[Navigation, Pagination, EffectCoverflow]}
              effect="coverflow"
              grabCursor={true}
              centeredSlides={true} // Changed to false
              loop={true} // Changed to false
              slidesPerView={4}
              spaceBetween={20} // Adjusted spacing
              coverflowEffect={{
                rotate: 0,
                stretch: 0,
                depth: 150,
                modifier: 2.5,
              }}
              pagination={{ clickable: true }}
              navigation
              onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
              className="mySwiper "
            >
              {Object.keys(groups).map((projectTitle, index) => (
                <SwiperSlide key={index}>
                  <div className="w-[330px] h-[330px] rounded-2xl bg-[#0069D9] p-8 text-white flex flex-col justify-between mx-auto">
                    <div>
                      <Link
                        href="#"
                        className="text-white cursor-pointer hover:text-gray-200"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-12 h-12"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                          />
                        </svg>
                      </Link>
                      <p className="text-base mt-2 font-bold break-words">
                        {projectTitle}
                      </p>
                    </div>
                    <div className="text-right mt-6">
                      {index === activeIndex ? ( // ✅ Only enable button if active
                        <Link
                          href={`/QAportal/Review?title=${encodeURIComponent(
                            projectTitle
                          )}`}
                        >
                          <button className="border border-white text-[#0069D9] text-sm font-semibold bg-white rounded px-4 py-2 hover:bg-[#0069D9] hover:text-white hover:border-white transition-all duration-300">
                            Review
                          </button>
                        </Link>
                      ) : (
                        <button
                          className="border border-gray-300 text-sm font-semibold bg-gray-200 text-gray-400 rounded px-4 py-2 cursor-not-allowed"
                          disabled
                        >
                          Review
                        </button>
                      )}
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          <QAupload />
        )}
        </div>
    </Layout>
  );
}
