import React, { useEffect, useState } from "react";
import axios from "axios";

export default function SupervisorNotification({ userId }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `/api/Notification/FetchNotification?userId=${userId}&role=supervisor`
        );
        setNotifications(response.data.notifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    if (userId) {
      // Ensure userId is defined
      fetchNotifications();
    }
  }, [userId]);

  return (
    <div className="container h-full w-full mx-auto">
    <div className="p-1 flex flex-col items-center justify-center">
      <div className="grid grid-cols-1 mx-auto md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <div
              key={index}
              className="box p-3 w-72 rounded-lg bg-[#0069D9] py-4 pl-4 flex flex-col justify-between"
              style={{ minHeight: '200px' }} // Adjust minHeight as needed
            >
              <div>
                <div className="flex justify-between">
                  <div className="flex items-center mb-2 italic">
                    <h3 className="text-lg capitalize text-white font-bold">
                      From{" "}
                    </h3>
                    <span className="capitalize text-lg ml-2 mr-2 font-bold text-white">
                      ({notification.userRole}
                    </span>
                    <h3 className="text-lg capitalize text-white font-bold">
                      Team)
                    </h3>
                  </div>
                  <div className="capitalize text-red-400 rounded-full bg-white p-2 text-sm font-bold">
                    <h3 className="">{notification.type}</h3>
                  </div>
                </div>
                <div className="mb-1">
                  <h1 className="text-white text-base font-semibold">
                    Rejection on{" "}
                    <span className="text-xs font-semibold italic text-red-300 capitalize">
                      ({notification.rollNumber})
                    </span>
                  </h1>
                </div>
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
              <div className="text-right mt-2">
                <p className="text-gray-300 font-semibold text-sm italic">
                  {new Date(notification.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No Notification Found</p>
        )}
      </div>
    </div>
  </div>
  );
}
