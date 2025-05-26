import React, { useEffect, useState } from "react";
import axios from "axios";

export default function StudentNotification({ userId, updateNotificationCount }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `/api/Notification/FetchNotification?userId=${userId}&role=student`
        );
        setNotifications(response.data.notifications);
        updateNotificationCount(response.data.notifications.length);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    if (userId) {
      fetchNotifications();
    }
  }, [userId, updateNotificationCount]);

  return (
    <div className="container h-full w-full mx-auto">
      <div className="p-1 flex flex-col items-center justify-center">
        <div className="grid grid-cols-1 mx-auto md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notifications.length > 0 ? (
            notifications.map((notification, index) => {
              const isSupervisor = notification.userRole === "supervisor";

              return (
                <div
                  key={index}
                  className="box p-3 w-72 rounded-lg bg-[#0069D9] py-4 pl-4 flex flex-col justify-between"
                  style={{ minHeight: "200px" }}
                >
                  <div>
                    {/* FROM Header */}
                    <div className="flex justify-between mb-1">
                      <div className="flex items-center mb-2 ">
                        <span className="capitalize text-xl ml-2 font-extrabold text-white">
                          {notification.userRole}
                          {isSupervisor ? "" : " Team"}
                        </span>
                      </div>

                      <div className="capitalize text-red-400 rounded-full bg-white p-2 text-sm font-bold">
                        <h3>{notification.type}</h3>
                      </div>
                    </div>

                    {/* Rejection Points — only show if NOT from supervisor */}
                    {!isSupervisor &&
                      notification.rejectedPoints?.length > 0 && (
                        <>
                          <div className="mb-1">
                            <h1 className="text-white text-base font-semibold">
                              Rejection{" "}
                              <span className="text-xs font-semibold italic text-red-300">
                                (Points)
                              </span>
                            </h1>
                          </div>
                          <ul className="text-red-400 text-sm mb-2">
                            {notification.rejectedPoints.map((point, idx) => (
                              <li key={idx}>• {point}</li>
                            ))}
                          </ul>
                        </>
                      )}

                    {/* Optional Message */}
                    {notification.optionalMessage && (
                      <div>
                        <h1 className="text-white text-base font-semibold">
                          Message:
                        </h1>
                        <p className="text-gray-300 italic text-sm rounded-lg font-medium overflow-auto">
                          {notification.optionalMessage}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Timestamp */}
                  <div className="text-right mt-2">
                    <p className="text-gray-300 font-semibold text-sm italic">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="fixed mt-40 inset-0 flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <div className="">
                  <iframe
                    src="https://lottie.host/embed/7cbb68ef-5b17-4ee5-a141-4a0b46836edd/vQTXkQ9LLR.lottie"
                    className="w-[260px] h-[260px] opacity-0 animate-fade-in mx-auto"
                  ></iframe>
                  <p className="text-red-500 text-base font-bold">
                    Notifications not Found!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}