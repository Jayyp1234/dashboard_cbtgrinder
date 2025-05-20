"use client";
import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { FaFilter } from "react-icons/fa";
import { Filter } from "@/components/ui/filter/page";
import { PencilIcon, TrashBinIcon, EyeIcon, ArrowRightIcon } from "@/icons";
import {
  AddQuestionModal,
  BulkUploadModal,
  DeleteModal,
} from "@/components/ui/modals/allModal";
import Swal from "sweetalert2";
import { useTheme } from "@/context/ThemeContext";
import { useParams, useRouter } from "next/navigation";
import { useGetQuestionsQuery, useDeleteQuestionMutation} from "@/lib/services/questionBank";
import Link from "next/link";
import Image from "next/image";
import { preventDefault } from "@fullcalendar/core/internal";


const customLoader = (
  <div className="w-full px-4 py-6 animate-pulse">
    <div className="overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg">
      {/* Table header */}
      <div className="grid grid-cols-8 bg-gray-100 dark:bg-gray-800 text-sm font-semibold text-gray-700 dark:text-gray-300">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={`header-${i}`}
            className="px-4 py-3 border-r last:border-r-0 border-gray-200 dark:border-gray-700"
          >
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
          </div>
        ))}
      </div>

      {/* Table rows */}
      {Array.from({ length: 5 }).map((_, rowIndex) => (
        <div
          key={`row-${rowIndex}`}
          className="grid grid-cols-8 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700"
        >
          {Array.from({ length: 8 }).map((_, colIndex) => (
            <div
              key={`cell-${rowIndex}-${colIndex}`}
              className="px-4 py-4 border-r last:border-r-0 border-gray-100 dark:border-gray-800"
            >
              <div className="h-3.5 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
);


export default function QuestionBank() {
  const router = useRouter();
  const params = useParams();
  const type = params?.question_bank?.toString().toUpperCase() || "JAMB";
  const subject = params?.subject?.toString() || "";
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortBy] = useState('created_at');
  const [sortOrder] = useState<'asc' | 'desc'>('desc');

  const [imageLoaded, setImageLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterSidebarVisible, setIsFilterSidebarVisible] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [uploadType, setUploadType] = useState<"bulk" | "single" | null>(null);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null);

  const [previewData, setPreviewData] = useState<{
    mode: string;
    question_text: string;
    options: { a: string; b: string; c: string; d: string };
    correct_option: string;
    topic: string;
    question_image?: string;
    hint?: string;
    explanation?: string;
  } | undefined | null>(undefined);

  const [deleteQuestion] = useDeleteQuestionMutation();

  const handleDelete = async () => {
    if (!selectedQuestionId) return;

    try {
      await deleteQuestion({ question_id: selectedQuestionId }).unwrap();
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "The question was successfully deleted.",
        timer: 2000,
        showConfirmButton: false
      });
      setIsDeleteModalOpen(false);
      setSelectedQuestionId(null);
      refetch();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Unable to delete the question. Try again.",
      });
    }
  };
  
  
  const { data, isLoading, refetch } = useGetQuestionsQuery(
    {
      page: currentPage,
      limit: rowsPerPage,
      subject,
      type,
      sort_by: sortBy,
      sort_order: sortOrder,
      search: searchTerm
    },
    {
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
      refetchOnFocus: true
    }
  );
  

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      refetch(); // manually refetch based on new search term
    }, 500); // wait 500ms after typing stops
  
    return () => clearTimeout(delayDebounce);
  }, [currentPage, rowsPerPage, searchTerm, sortBy, sortOrder, refetch]);
  

  const handleBulkSubmit = (file: File | null) => {
    console.log("Uploading file:", file);
  };

  const handleUploadType = (type: string) => {
    if (type === "bulk" || type === "single") {
      setUploadType(type);
      setIsAddModalOpen(false);
      if (type === "bulk") {
        setIsBulkModalOpen(true);
      }
    } else {
      console.warn("Invalid upload type:", type);
    }
  };
  
  const columns = [
    {
      name: "No.",
      cell: (_: any, index: number) => (
        <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
          {(currentPage - 1) * rowsPerPage + index + 1}
        </div>
      ),
      width: "60px",
      sortable: false,
    },
    {
      name: "QUESTION",
      cell: (row: { question_text: string }) => {
        // 1. Strip HTML tags
        const rawText = row.question_text.replace(/<[^>]*>/g, '');
    
        // 2. Truncate to 50 characters
        const truncated = rawText.length > 30 ? rawText.slice(0, 30) + '...' : rawText;
    
        return (
          <div className="text-sm text-gray-800 dark:text-gray-200">
            {truncated}
          </div>
        );
      },
      sortable: true,
    }
    ,
    {
      name: "A",
      selector: (row: { options: { a: string } }) => row.options.a,
      sortable: true,
    },
    {
      name: "B",
      selector: (row: { options: { b: string } }) => row.options.b,
      sortable: true,
    },
    {
      name: "C",
      selector: (row: { options: { c: string } }) => row.options.c,
      sortable: true,
    },
    {
      name: "D",
      selector: (row: { options: { d: string } }) => row.options.d,
      sortable: true,
    },
    {
      name: "ANSWER",
      selector: (row: { correct_option: string }) => row.correct_option,
      sortable: true,
    },
    {
      name: "TOPIC",
      selector: (row: { topic: string }) => row.topic,
      sortable: true,
    },
    {
      name: "TYPE",
      cell: (row: { mode: string }) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            row.mode === "MCQ"
              ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
              : row.mode === "THEORY"
              ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
              : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          }`}
        >
          {row.mode}
        </span>
      ),
    },
    {
      name: "ACTIONS",
      cell: (row: {
        id: number;
        mode: string;
        question_text: string;
        options: { a: string; b: string; c: string; d: string };
        correct_option: string;
        topic: string;
      }) => (
        <div className="space-x-2 flex items-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setPreviewData(row);
              setShowPreview(true);
            }}
            className="text-green-500 dark:text-green-400 hover:text-green-600 dark:hover:text-green-300"
          >
            <EyeIcon />
          </button>
          <button className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300">
            <PencilIcon />
          </button>
          <button onClick={() => {
            setSelectedQuestionId(row.id);
            setIsDeleteModalOpen(true);
          }} className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300">
            <TrashBinIcon />
          </button>
        </div>
      ),
    },
  ];

  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const customStyles = {
    pagination: {
      style: {
        display: "flex",
        justifyContent: "space-between",
        backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
        color: isDarkMode ? "#ffffff" : "#1f2937",
        borderTop: `1px solid ${isDarkMode ? "#4b5563" : "#e5e7eb"}`,
        padding: "16px",
      },
      pageButtonsStyle: {
        borderRadius: "8px",
        height: "32px",
        width: "32px",
        padding: "6px",
        margin: "0 4px",
        cursor: "pointer",
        color: isDarkMode ? "#ffffff" : "#1f2937",
        fill: isDarkMode ? "#ffffff" : "#1f2937",
        backgroundColor: isDarkMode ? "#374151" : "#f3f4f6",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        "&:hover": {
          backgroundColor: isDarkMode ? "#4b5563" : "#e5e7eb",
        },
      },
    },
  };

  return (
    <div>
      <div className="mb-3">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 ">
          <ArrowRightIcon className="rotate-180"/>
          <span>Back</span>
        </button>
      </div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Questions</h1>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 text-sm rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white"
          >
            + Add Questions
          </button>
         <Link href={`/dashboard/${type}/${subject}/questions/drafts`}>
            <button className="px-4 py-2 text-sm rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white flex items-center">
              Drafts
              <span className="ml-2 px-2 py-0.5 text-xs rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100">{data?.meta?.draft_count}</span>
            </button>
         </Link>
          <button
            className="px-4 py-2 text-sm rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white flex items-center"
            onClick={() => setIsFilterSidebarVisible(!isFilterSidebarVisible)}
          >
            <FaFilter className="mr-2" />
            Filter by
          </button>
          <button className="text-sm text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white">
            Clear Filters ✕
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
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
            placeholder="Search by question..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="dark:bg-gray-900 h-11 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white py-2.5 pl-12 pr-14 text-sm text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40 focus:border-blue-300 dark:focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800/40"
          />
        </div>
      </div>

      {/* Filter Sidebar */}
      {isFilterSidebarVisible && (
        <Filter isOpen={isFilterSidebarVisible} onClose={() => setIsFilterSidebarVisible(false)} />
      )}

      {/* DataTable */}
      <div className="overflow-x-auto">
      {/* <DataTable
        columns={columns}
        data={data?.data || []}
        progressPending={isLoading}
        progressComponent={customLoader}
        pagination
        paginationServer
        paginationTotalRows={data?.meta?.pagination?.total_items || 0}
        onChangeRowsPerPage={(newLimit, page) => {
          setRowsPerPage(newLimit);
          setCurrentPage(page);
        }}
        onChangePage={(page) => setCurrentPage(page)}
        customStyles={customStyles}
        className="dark:bg-gray-900 dark:text-white"
      /> */}
      <DataTable
        columns={columns}
        data={data?.data || []}
        progressPending={isLoading}
        progressComponent={customLoader}
        pagination
        paginationServer
        paginationTotalRows={data?.meta?.pagination?.total_items || 0}
        onChangeRowsPerPage={(newLimit) => {
          setRowsPerPage(newLimit);
          setCurrentPage(1); // Reset to first page when limit changes
        }}
        onChangePage={(page) => {
          setCurrentPage(page);
        }}
        customStyles={customStyles}
        className="dark:bg-gray-900 dark:text-white"
      />


      </div>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={() => {handleDelete(); setIsDeleteModalOpen(false)}}
      />

      {/* Add Question Modal */}
      <AddQuestionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleUploadType}
        type={type}
        subjectId={subject}
      />

      {/* Bulk Upload Modal */}
      <BulkUploadModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        onSubmit={handleBulkSubmit}
        subjectId={subject} 
        subjectType={type}
      />

      {showPreview && previewData && (
        <div className="bg-black/50 fixed inset-0 z-[99999] flex justify-end">
          <div className="bg-white dark:bg-gray-900 w-full sm:w-[80%] md:w-[60%] lg:w-[40%] xl:w-[30%] h-full shadow-2xl flex flex-col p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Question Preview</h2>
              <button
                onClick={() => {
                  setShowPreview(false);
                  setPreviewData(null);
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white text-2xl"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3">
            {previewData?.question_image && (
                <div className="relative w-[150px] h-[150px]">
                  {/* Skeleton while loading */}
                  {!imageLoaded && (
                    <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md" />
                  )}

                  <Image
                    src={previewData?.question_image}
                    alt="Question Related"
                    width={150}
                    height={150}
                    className={`rounded-md transition-opacity duration-300 ${
                      imageLoaded ? "opacity-100" : "opacity-0"
                    }`}
                    onLoadingComplete={() => setImageLoaded(true)}
                  />
                </div>
              )}
              {/* Question */}
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <h3 className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Question</h3>
                <div
                  className="text-base text-gray-800 dark:text-gray-100 space-y-2"
                  dangerouslySetInnerHTML={{ __html: previewData.question_text }}
                ></div>
              </div>


              {/* Options */}
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <h3 className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-2">Options</h3>
                <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-200">
                  <li><strong className="text-gray-900 dark:text-white">A:</strong> {previewData.options?.a}</li>
                  <li><strong className="text-gray-900 dark:text-white">B:</strong> {previewData.options?.b}</li>
                  <li><strong className="text-gray-900 dark:text-white">C:</strong> {previewData.options?.c}</li>
                  <li><strong className="text-gray-900 dark:text-white">D:</strong> {previewData.options?.d}</li>
                </ul>
              </div>

              {/* Answer */}
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Correct Answer</span>
                <span className="text-sm font-bold text-green-600 dark:text-green-400">{previewData.correct_option}</span>
              </div>

              {/* Topic and Type */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">Topic</span>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{previewData.topic}</p>
                </div>
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">Type</span>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{previewData.mode}</p>
                </div>
              </div>

              {/* Hint (if exists) */}
              {previewData.hint && (
                <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900">
                  <span className="text-sm text-yellow-700 dark:text-yellow-300 font-semibold">Hint:</span>
                  <p className="text-sm text-yellow-800 dark:text-yellow-100 mt-1">{previewData.hint}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}