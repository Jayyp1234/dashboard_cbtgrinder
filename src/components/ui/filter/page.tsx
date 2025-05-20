'use client';
import { FaTimes } from "react-icons/fa";
import React, { useState, useRef } from "react";
import { AddTopicModal, YearPickerModal } from "../modals/allModal";
import Select from "react-select";
import { useParams } from "next/navigation";
import { useGetSubjectTopicsQuery,useGetQuestionAuthorsQuery,useDeleteSubjectTopicMutation } from "@/lib/services/questionBank";
import { FiTrash } from "react-icons/fi";
import Swal from 'sweetalert2';
// Removed unused DateType

type FilterProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const Filter = ({ isOpen, onClose }: FilterProps) => {
  const params = useParams();
  const type = params?.question_bank?.toString().toUpperCase() || "JAMB";
  const subject = params?.subject?.toString() || "";
  const [selectedFromDate] = useState<Date | null>(null);
  const [selectedToDate] = useState<Date | null>(null);
  const [selectedType] = useState<string | null>(null);
  const [selectedStatus] = useState<string | null>(null);
  const [draftChecked, setDraftChecked] = useState(false);
  const [publishedChecked, setPublishedChecked] = useState(false);
  const [isYearModalOpen, setIsYearModalOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedAuthors] = useState<string[]>([]);
  const [isAddTopicModalOpen, setIsAddTopicModalOpen] = useState(false);
  
  const { data: topics, refetch: refetchTopics } = useGetSubjectTopicsQuery({
    subjectId: subject, subjectType: type, },
  { refetchOnMountOrArgChange: true, refetchOnReconnect: true,        // optional: refetch on network reconnection
  });
  const { data:authors } = useGetQuestionAuthorsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [deleteSubjectTopic] = useDeleteSubjectTopicMutation();

  const handleDeleteTopic = async (topicId: number) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: "This will remove the topic from the list!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (confirm.isConfirmed) {
      // Show loading modal
      Swal.fire({
        title: 'Deleting...',
        html: 'Please wait while the topic is being deleted.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        const res = await deleteSubjectTopic({ topic_id: topicId }).unwrap();
        
        // Close loader
        Swal.close();

        if (res.status) {
          refetchTopics();
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'The topic was deleted successfully.',
            timer: 2000,
            showConfirmButton: false,
          });

        } else {
          Swal.fire({
            icon: 'error',
            title: 'Failed',
            text: res.text || 'An error occurred while deleting the topic.',
          });
        }

      } catch (err) {
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Something went wrong. Please try again later.',
        });
      }
    }
  };

  // const handleChange = (selected: { label: string; value: string }[] | null) => {
  //   setSelectedAuthors(selected ? selected.map((item) => item.value) : []);
  // };
  
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  const handleApply = () => {
    const noResults = !selectedFromDate && !selectedToDate && !selectedType && !selectedStatus; 
    console.log(noResults ? "No results" : "Filters applied");
  };

  const isApplyEnabled = selectedFromDate || selectedToDate || selectedType || selectedStatus;
  if (!isOpen) return null;

  return (
    <aside
      ref={sidebarRef}
      className="bg-black/50 fixed inset-0 z-[99999] flex justify-end"
    >
      <div className="bg-white w-full sm:w-[80%] md:w-[60%] lg:w-[40%] xl:w-[30%] h-full shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">Filter</h2>
          <button
            className="text-gray-600 hover:text-red-500 transition"
            onClick={onClose}
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          {/* Topic */}
          <div className="mb-4">
          <div className="mb-2 flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Topics
            </label>
            <div className="flex items-center space-x-2">
              <button
              className="text-sm text-white bg-red-500 px-2 py-1 rounded-md"
              onClick={() => {
                const checkboxes = document.querySelectorAll(
                'input[name="mathTopics"]'
                ) as NodeListOf<HTMLInputElement>;
                checkboxes.forEach((checkbox) => {
                checkbox.checked = false;
                });
              }}
              >
              Clear All
              </button>

              <button
                className="flex items-center text-sm text-white bg-blue-500 px-2 py-1 rounded-md"
                onClick={() => setIsAddTopicModalOpen(true)}
              >
                <span className="mr-1">Add Topic</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {topics?.data?.map((topic: { id: string; name: string }) => (
              <label
                key={topic.id}
                className="flex items-center justify-between p-2 bg-gray-50 hover:bg-gray-100 rounded-md border border-gray-200"
              >
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="mathTopics[]"
                    value={topic.id}
                    className="form-checkbox h-4 w-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">{topic.name}</span>
                </div>

                {/* Floating Delete Icon */}
                <button
                  type="button"
                  title="Delete Topic"
                  onClick={() => handleDeleteTopic(parseInt(topic.id))} // Replace with your handler
                  className="text-red-500 hover:text-red-600 transition"
                >
                  <FiTrash className="w-4 h-4" />
                </button>
              </label>
            ))}
          </div>

        </div>

        {/* Author */}
        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Authors
            </label>
            <span className="text-sm text-gray-500">Select one or more</span>
          </div>
          <Select
            isMulti
            name="authors"
            options={authors?.data}
            value={selectedAuthors}
            className="basic-multi-select"
            classNamePrefix="select"
            placeholder="Select authors..."
          />

        </div>



          {/* Year */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <input
              type="text"
              readOnly
              value={selectedYear || ""}
              onClick={() => setIsYearModalOpen(true)}
              placeholder="Select year"
              className="w-full px-4 py-2 border rounded-md cursor-pointer bg-white focus:outline-none"
            />

          </div>

          

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <div className="flex gap-6">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={draftChecked}
                  onChange={() => setDraftChecked(!draftChecked)}
                  className="form-checkbox h-3.5 w-3.5 text-blue-600"
                />
                <span className="ml-2 text-gray-700">Draft</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={publishedChecked}
                  onChange={() => setPublishedChecked(!publishedChecked)}
                  className="form-checkbox h-3.5 w-3.5 text-blue-600"
                />
                <span className="ml-2 text-gray-700">Published</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={!isApplyEnabled}
            className={`px-4 py-2 text-sm font-semibold rounded-md ${
              isApplyEnabled
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Apply Filters
          </button>
        </div>
      </div>

      <YearPickerModal
        isOpen={isYearModalOpen}
        onClose={() => setIsYearModalOpen(false)}
        onSelectYear={(year) => {
          setSelectedYear(year);
          setIsYearModalOpen(false);
        }}
        initialYear={selectedYear || undefined}
      />
      <AddTopicModal
        isOpen={isAddTopicModalOpen}
        onClose={() => setIsAddTopicModalOpen(false)}
        subjectId ={subject}
        subjectType = {type}
        onCreated={() => refetchTopics()} // 👈 Pass as a callback
      />
    </aside>
  );
};
