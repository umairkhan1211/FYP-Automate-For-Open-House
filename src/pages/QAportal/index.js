import React, { useState, useEffect, useRef } from "react";
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
  const userId = decoded?.id;

  return {
    props: { token, department, userId },
  };
}

export default function Index({ token, department, userId }) {
  const [groups, setGroups] = useState({});
  const [projectTitleIndexMap, setProjectTitleIndexMap] = useState([]);
  const [showUpload, setShowUpload] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const swiperRef = useRef(null);
  const suggestionBoxRef = useRef(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await axios.post("/api/FetchRecords/GetQaGroup", {
          department,
        });
        const fetchedGroups = res.data.groups || {};
        setGroups(fetchedGroups);

        const titles = Object.keys(fetchedGroups);
        const titleMap = titles.map((title, index) => ({
          normalized: title.trim().toLowerCase(),
          actual: title,
          index,
        }));
        setProjectTitleIndexMap(titleMap);
      } catch (err) {
        console.error("Error fetching QA groups", err);
      }
    };
    fetchGroups();
  }, [department]);

  const handleSearch = () => {
    if (!searchTerm.trim() || !swiperRef.current) return;

    const normalizedSearch = searchTerm.trim().toLowerCase();
    const found = projectTitleIndexMap.find(
      (item) => item.normalized === normalizedSearch
    );

    if (found) {
      swiperRef.current.swiper.slideToLoop(found.index);
      setSuggestions([]);
    } else {
      alert("No exact match found for the project title.");
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.actual);
    swiperRef.current.swiper.slideToLoop(suggestion.index);
    setSuggestions([]);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    const filtered = projectTitleIndexMap.filter((item) =>
      item.actual.toLowerCase().startsWith(value.toLowerCase())
    );

    setSuggestions(value ? filtered : []);
  };

  return (
    <Layout token={token}>
      <div className="pb-10 container mx-auto overflow-x-hidden">
        <div className="flex">
          <div className="w-6/12 min-w-lg mx-auto p-6 space-x-2">
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

          {/* Search Bar with Suggestions */}
          <div className="max-w-lg mx-auto py-4 text-[#0069D9] font-bold relative w-1/3 ">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search projects..."
                className="w-full py-3 px-6 pr-12 rounded-full border-2 border-gray-200 focus:border-[#0069D9] focus:outline-none shadow-lg transition-all duration-300"
                value={searchTerm}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
              />
              <button
                onClick={handleSearch}
                className="absolute right-2 bg-[#0069D9] text-white p-2 rounded-full hover:bg-[#0056b3] transition-all duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>

            {/* Suggestions Dropdown */}
            {suggestions.length > 0 && (
              <ul
                ref={suggestionBoxRef}
                className="absolute z-10 w-full  bg-white shadow-lg rounded-md mt-2 max-h-60 overflow-y-auto border border-gray-200"
              >
                {suggestions.map((suggestion, i) => (
                  <li
                    key={i}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-4 py-2 cursor-pointer text-[#0069D9] hover:bg-gray-100 "
                  >
                    {suggestion.actual}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {showUpload ? (
          <div className="px-8 py-8">
            <Swiper
              ref={swiperRef}
              modules={[Navigation, Pagination, EffectCoverflow]}
              effect="coverflow"
              grabCursor={true}
              centeredSlides={true}
              loop={true}
              slidesPerView={4}
              spaceBetween={20}
              coverflowEffect={{
                rotate: 0,
                stretch: 0,
                depth: 150,
                modifier: 2.5,
              }}
              pagination={{ clickable: true }}
              navigation
              onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
              className="mySwiper"
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
                      {index === activeIndex ? (
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
