"use client";
import { useParams } from "next/navigation";
import { useGetSubjectCategoriesQuery } from "@/lib/services/questionBank";
import Image from "next/image";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import { FaUserAlt, FaClipboardList } from "react-icons/fa";
import PageBreadcrumb from "@/components/common/PageBreadCrumb"; // Adjust the path as needed

export default function QuestionBank() {
  const params = useParams();
  const type = params?.question_bank?.toString().toUpperCase() || "JAMB";
  const { data, isLoading} = useGetSubjectCategoriesQuery( { type }, { refetchOnMountOrArgChange: true });
  const [searchTerm, setSearchTerm] = useState("");
  const subjects = useMemo(() => data?.data ?? [], [data]);

  const filteredSubjects = useMemo(() => {
    return subjects.filter((subject: {name: string}) =>
      subject.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, subjects]);

  return (
    <div className="text-gray-800 dark:text-white">
      {/* Header */}
      <PageBreadcrumb pageTitle = {type}/>
      {/* <div className="flex flex-wrap justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold capitalize">{type} Subjects</h1>
      </div> */}
     

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative w-full">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              className="fill-gray-500 dark:fill-gray-400"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
              />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search by subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="dark:bg-gray-900 h-11 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white py-2.5 pl-12 pr-14 text-sm text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40 focus:border-blue-300 dark:focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800/40"
          />
        </div>
      </div>

      {/* Subject Cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {isLoading ? (
          Array(8)
            .fill(null)
            .map((_, idx) => (
              <div
                key={idx}
                className="animate-pulse bg-gray-100 dark:bg-gray-800 p-5 rounded-xl h-[220px]"
              >
                <div className="w-full h-20 mb-3 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
                <div className="w-1/2 h-4 mb-2 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="w-1/3 h-3 mb-1 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="w-2/3 h-3 mb-3 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="w-full h-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
              </div>
            ))
        ) : filteredSubjects.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 dark:text-gray-400">
            <Image
              src="/empty_subject.png"
              alt="No subjects"
              width={300}
              height={300}
              className="mx-auto mb-3"
            />
            <p>No subjects found for {type}.</p>
          </div>
        ) : (
          filteredSubjects.map((subject: {slug: string, name: string, author: string, no_questions: string}, index: number) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition duration-200"
            >
              <div className="flex mb-3 gap-3 items-center">

                {/* Image */}
                {subject.slug && (
                    <Image
                      src={`/images/subjects/${subject.slug}.png`}
                      alt={subject.name}
                      width={70}
                      height={70}
                      className=""
                    />
                )}

                <div>
                  {/* Subject name */}
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                    {subject.name}
                  </h2>

                  {/* Authors */}
                  <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm mb-1">
                    <FaUserAlt className="mr-2" />
                    {subject.author} authors
                  </div>

                  {/* Questions */}
                  <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm mb-1">
                    <FaClipboardList className="mr-2" />
                    {subject.no_questions} questions
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Link href={`/dashboard/${type}/${subject.name}/questions`}>
                  <button className="w-full mb-3 bg-blue-700 text-white py-2 rounded-md hover:bg-blue-800 transition">
                    Preview questions
                  </button>
                </Link>
                <button className="w-full border border-red-500 text-red-500 py-2 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 transition hidden">
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
