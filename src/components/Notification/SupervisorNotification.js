import React from 'react'

export default function SupervisorNotification() {
  return (
    <>
          <div className="container h-[75vh] mx-auto ">
        <div className="p-1 flex flex-col items-center justify-center ">
          <div className="grid grid-cols-1 mx-auto md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="box p-3 w-72 rounded-lg bg-[#0069D9] py-4 pl-4">
              <h3 className="text-xl text-white font-semibold mb-2">
                From QA Team
              </h3>
              <p className="text-white text-md">
                FYP document is missing UML diagrams.
              </p>
            </div>
            <div className="box p-3 w-72 rounded-lg bg-[#0069D9] py-4 pl-4">
              <h3 className="text-xl text-white font-semibold mb-2">From QA Team</h3>
              <p className="text-white text-md">
                The video length is below 7 minutes. Please re-upload.
              </p>
            </div>
            <div className="box p-3 w-72 rounded-lg bg-[#0069D9] py-4 pl-4">
              <h3 className="text-xl text-white font-semibold mb-2">
                From QA Team
              </h3>
              <p className="text-white text-md ">
                Your uplaoded FYP document is not formatted correctly, Considerr
                it again .
              </p>
            </div>
            <div className="box p-3 w-72 rounded-lg bg-[#0069D9] py-4 pl-4">
              <h3 className="text-xl text-white font-semibold mb-2">From QA Team</h3>
              <p className="text-white text-md">
                Banner image is no suitable according to you Video tittle.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
