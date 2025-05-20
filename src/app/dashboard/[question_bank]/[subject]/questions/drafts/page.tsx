"use client";

import Pagination from "@/components/tables/Pagination";
import { EditDraftModal } from "@/components/ui/modals/allModal";
import { ArrowRightIcon, PencilIcon } from "@/icons";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useGetQuestionsQuery, useBulkUpdateQuestionStatusMutation, useBulkDeleteQuestionStatusMutation} from "@/lib/services/questionBank";
import Swal from "sweetalert2";

export interface Question {
  id: number;
  text: string;
  options: string[];
  hint?: string;
  answer?: string;
  image?: string;
  subject?: string;
  topic?: string;
  year?: number;
  explanation?: string;
}


export default function QuestionBank() {
  const [showHint, setShowHint] = useState(false);
  const [hintQuestion, setHintQuestion] = useState<Question | null>(null);
  const [selectedQuestions, setSelectedQuestions] = useState<Record<number, boolean>>({});
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number | null>>({});
  const [editQuestion, setEditQuestion] = useState<Question | null>(null);
  const router = useRouter();
  const params = useParams();
  const type = params?.question_bank?.toString().toUpperCase() || "JAMB";
  const subject = params?.subject?.toString() || "";
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [sortBy] = useState("created_at");
  const [sortOrder] = useState<'asc' | 'desc'>("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const hasAnySelected = Object.values(selectedQuestions).some(Boolean);
  const { data, isLoading, refetch } = useGetQuestionsQuery(
    {
      page: currentPage,
      limit: rowsPerPage,
      subject,
      type,
      sort_by: sortBy,
      sort_order: sortOrder,
      search: searchTerm,
      status: "0",
    },
    {
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
      refetchOnFocus: true,
    }
  );
  const [bulkDeleteQuestion] = useBulkDeleteQuestionStatusMutation();
  const [bulkUpdateQuestionStatus] = useBulkUpdateQuestionStatusMutation();

  if (isLoading) return <p className="text-center py-10">Loading questions...</p>;
  if (!data || !data.data) return <p className="text-center py-10">No questions found.</p>;

  const questions: Question[] = data.data.map((q: any) => ({
    id: q.id,
    text: q.question_text,
    options: [q.options?.a || "", q.options?.b || "", q.options?.c || "", q.options?.d || ""],
    answer: q.correct_option?.toUpperCase(),
    hint: q.hint,
    image: q.question_image ? `${q.question_image}` : undefined,
    subject: q.subject,
    topic: q.topic,
    year: q.year,
    explanation: q.explanation,
  }));
  
  const totalPages = Math.ceil((data?.meta?.pagination?.total_items || 0) / rowsPerPage);
  const displayedQuestions = questions;

  const handleCheckboxChange = (questionId: number) => {
    setSelectedQuestions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const handleSelectAll = () => {
    const allIds = displayedQuestions.map((q) => q.id);
    const allSelected = allIds.every((id) => selectedQuestions[id]);

    const updated = allIds.reduce((acc, id) => {
      acc[id] = !allSelected;
      return acc;
    }, {} as Record<number, boolean>);

    setSelectedQuestions((prev) => ({ ...prev, ...updated }));
  };


  const handleEditQuestion = (question: Question) => {
    setEditQuestion(question);
  };

  const handleSaveEdit = (editedQuestion: Question) => {
    // You can also send to backend then call refetch()
    setEditQuestion(null);
    refetch();
  };


  const handlePublishSelected = async () => {
    const selectedIds = Object.keys(selectedQuestions)
      .filter((id) => selectedQuestions[parseInt(id)])
      .map((id) => parseInt(id));
  
    if (selectedIds.length === 0) return;
  
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to publish ${selectedIds.length} question(s). Proceed?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, publish them!",
    });
  
    if (!confirm.isConfirmed) return;
  
    Swal.fire({
      title: "Publishing...",
      html: "Please wait while we publish selected questions.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  
    try {
      const response = await bulkUpdateQuestionStatus({ ids: selectedIds, status: 1 }).unwrap();
  
      if (response.status) {
        Swal.fire("Success", "Selected questions published", "success");
        setSelectedQuestions({});
        refetch();
      } else {
        Swal.fire("Failed", "Could not update some questions", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "An error occurred while publishing", "error");
    }
  };

  

  const handleDeleteSelected = async () => {

    const selectedIds = Object.keys(selectedQuestions)
      .filter((id) => selectedQuestions[parseInt(id)])
      .map((id) => parseInt(id));
  
    if (selectedIds.length === 0) return;
  
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete ${selectedIds.length} question(s). Proceed?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete them!",
    });
  
    if (!confirm.isConfirmed) return;
  
    Swal.fire({
      title: "Deleting...",
      html: "Please wait while we delete selected questions.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await bulkDeleteQuestion({ ids: selectedIds }).unwrap();

      if (response.status) {
        Swal.fire("Deleted", "Selected questions have been deleted.", "success");
        setSelectedQuestions({});
        refetch();
      } else {
        Swal.fire("Failed", "Could not delete some questions.", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "An error occurred while deleting questions.", "error");
    }
  };

  return (
    <>
      <div className="mb-3">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 ">
          <ArrowRightIcon className="rotate-180"/>
          <span>Back</span>
        </button>
      </div>
      <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-6 rounded-lg shadow-md">
        <div className="mb-6 border-b pb-2">
          <h1 className="text-xl font-semibold">Drafts</h1>
          <span className="text-sm">Total drafts: {questions.length}</span>
        </div>
  
        <div className="mb-5 flex items-center gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="select-all"
              onChange={handleSelectAll}
              checked={
                displayedQuestions.length > 0 &&
                displayedQuestions.every((q) => selectedQuestions[q.id])
              }
              className="mr-2 h-4 w-4"
            />
            <label htmlFor="select-all" className="text-sm">
              Select All
            </label>
          </div>
          
          {hasAnySelected && (
            <div className="flex flex-wrap justify-end gap-4">
              <button
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm"
                onClick={handlePublishSelected}
              >
                ✅ Publish Selected
              </button>
              <button
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm"
                onClick={handleDeleteSelected}
              >
                🗑️ Delete Selected
              </button>
             
            </div>
          )}

        </div>
  
        <div className="space-y-6">
          {displayedQuestions.map((question, index) => (
            <div
              key={question.id}
              onClick={() => handleCheckboxChange(question.id)}
              className="border p-4 rounded-lg relative cursor-pointer"
            >
              

              {/* Image + Edit button */}
              <div className="flex justify-between items-start mb-2">
                <>
                  {/* Prevent checkbox itself from bubbling the click (to avoid double toggle) */}
                    <input
                      type="checkbox"
                      id={`select-question-${question.id}`}
                      checked={!!selectedQuestions[question.id]}
                      onChange={() => handleCheckboxChange(question.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="h-4 w-4 mb-3"
                    />
                    {question.image && (
                      <div className="w-24 h-24 relative rounded-md overflow-hidden">
                        <div className="w-24 h-24 relative rounded-md overflow-hidden">
                          <Image
                            src={question.image}
                            alt={`Question ${question.id}`}
                            layout="fill"
                            objectFit="contain"
                          />
                        </div>
                      </div>
                    )}
                </>
                
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditQuestion(question);
                  }}
                  className="hover:underline flex items-center gap-1"
                >
                  <PencilIcon />
                  Edit
                </button>
              </div>

              {/* Question text */}
              <div className="mb-1">
                <label htmlFor={`select-question-${question.id}`} className="font-medium">
                  {index+1}.
                </label>{" "}
                <span>{question.text}</span>
              </div>

              {/* Options */}
              <div className="ml-5 space-y-2 mt-2">
                {question.options.map((option, idx) => (
                  <div key={idx} className="flex items-center">
                    <input
                      type="radio"
                      id={`q${question.id}-option${idx}`}
                      name={`question-${question.id}`}
                      checked={selectedAnswers[question.id] === idx}
                      onChange={(e) => {
                        e.stopPropagation();
                        setSelectedAnswers((prev) => ({ ...prev, [question.id]: idx }));
                      }}
                      className="mr-2 h-3.5 w-3.5"
                    />
                    <label htmlFor={`q${question.id}-option${idx}`}>{option}</label>
                  </div>
                ))}
              </div>

              {/* Answer and Explanation */}
              <div className="mt-2 text-green-700 text-sm">
                ✅ <strong>Answer:</strong> {question.answer}
              </div>

              <div className="mt-1 text-gray-600 text-sm">
                💡 <strong>Hint:</strong> {question.hint || "None"}
              </div>

              <div className="mt-1 text-gray-600 text-sm">
                💡 <strong>Explanation:</strong> {question.explanation}
              </div>
             
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
  
        <div className="mt-8 flex justify-end">
          <button
            disabled={Object.values(selectedQuestions).filter(Boolean).length === 0}
            className="bg-brand-500 hover:bg-blue-600 dark:bg-brand-500 dark:hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm disabled:opacity-50"
          >
            Publish Selected
          </button>
        </div>
  
        {showHint && hintQuestion && (
          <div className="bg-black/50 fixed inset-0 z-[99999] flex justify-end">
            <div className="bg-white w-full sm:w-[80%] md:w-[60%] lg:w-[40%] xl:w-[30%] h-full shadow-xl flex flex-col p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Hint</h2>
                <button
                  onClick={() => setShowHint(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-white"
                >
                  ✕
                </button>
              </div>
              <p>
                Hint: {hintQuestion?.hint}
              </p>
            </div>
          </div>
        )}
  
  
        {/* Edit Modal */}
        {editQuestion && (
          <EditDraftModal
            isOpen={!!editQuestion}
            onClose={() => setEditQuestion(null)} // Close modal on cancel
            onSubmit={handleSaveEdit} // Handle the save action
            question={editQuestion}
          />
        )}
      </div>
    </>
  );
}
