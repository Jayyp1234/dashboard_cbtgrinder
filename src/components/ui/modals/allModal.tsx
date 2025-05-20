"use client";
import React, { useEffect, useState } from "react";
import { Modal } from "../modal";
import Input from "@/components/form/input/InputField";
import Link from "next/link";
import { useCreateSubjectTopicMutation, useCreateQuestionsMutation  } from "@/lib/services/questionBank";
import { FaUpload } from "react-icons/fa";
import Image from "next/image";
import Label from "@/components/form/Label";
import TextArea from "@/components/form/input/TextArea";
import { parseQuestionExcel } from "@/hooks/parseExcel";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";


const Spinner = () => (
  <svg
    className="animate-spin h-5 w-5 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v8H4z"
    ></path>
  </svg>
);


interface YearPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectYear: (year: number) => void;
  initialYear?: number;
}

export const YearPickerModal: React.FC<YearPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectYear,
  initialYear,
}) => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(initialYear || currentYear);

  const handleConfirm = () => {
    onSelectYear(selectedYear);
    onClose();
  };

  const years = Array.from({ length: 30 }, (_, i) => currentYear - i); // Last 30 years

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-md mx-auto"
      modalHeader={{
        hasHeader: true,
        modalTitle: "Select a Year",
        style: "border-b"
      }}
    >
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-4 gap-3 max-h-96 overflow-y-auto">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => {
                  setSelectedYear(year);
                  handleConfirm();
                }}
              className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                selectedYear === year
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white"
              }`}
            >
              {year}
            </button>
          ))}
        </div>
        <button
          onClick={handleConfirm}
          className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors hidden"
        >
          Confirm
        </button>
      </div>
    </Modal>
  );
};


interface AddTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjectId: string;
  subjectType: string;
  onCreated: () => void;
}

export const AddTopicModal: React.FC<AddTopicModalProps> = ({
  isOpen,
  onClose,
  subjectId,
  subjectType,
  onCreated,
}) => {
  const [createSubjectTopic, { isLoading, error}] = useCreateSubjectTopicMutation();
  const [topic, setTopic] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleConfirm = async () => {
    if (!topic.trim()) return;

    try {
      const response = await createSubjectTopic({
        name: topic,
        subject_id: subjectId,
        subject_type: subjectType,
      }).unwrap();
      console.log("Created successfully:", response);
      // ✅ Show success alert
      setSuccessMessage(`“${topic}” was successfully added.`);

      if (onCreated) {
        onCreated(); // ✅ Refetch topics list
      }
      setTopic(""); // Reset input
      onClose();     // Close modal
    } catch (err) {
      console.error("Creation failed:", err);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-md mx-auto"
      modalHeader={{
        hasHeader: true,
        modalTitle: "Add a topic",
        style: "border-b",
      }}
    >
      <div className="p-6 space-y-4">
        <Input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter topic name"
        />

        <button
          onClick={handleConfirm}
          disabled={isLoading}
          className={`w-full mt-4 px-4 py-2 flex items-center justify-center gap-2 rounded-md transition-colors ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {isLoading ? (
            <>
              <Spinner />
              Creating...
            </>
          ) : (
            "Confirm"
          )}
        </button>


        {error && (
          <p className="text-red-500 text-sm">Failed to create topic. Please try again.</p>
        )}
        {successMessage && (
          <p className="text-green-500 text-sm">{successMessage}</p>
        )}
      </div>
    </Modal>
  );
};

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onDelete,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-md mx-auto"
      modalHeader={{
        hasHeader: true,
        modalTitle: "Delete Confirmation",
        style: "border-b",
      }}
    >
      <div className="pb-10 flex flex-col gap-y-4 w-full sm:w-10/12 md:w-9/12 mx-auto">
        <div className="flex flex-col flex-grow gap-y-3 px-4">
          <section className="mt-4 text-center">
            <h2 className="text-2xl font-semibold text-red-600">
              Are you sure?
            </h2>
            <p className="text-base mt-2 text-gray-700">
              This action cannot be undone.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={onClose}
                className="w-full sm:w-40 py-3 rounded-lg border bg-gray-100 border-gray-300 hover:bg-gray-300 text-gray-800 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={onDelete}
                className="w-full sm:w-40 py-3 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-all duration-200"
              >
                Delete
              </button>
            </div>
          </section>
        </div>
      </div>
    </Modal>
  );
};

interface AddQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (uploadType: string) => void;
  type: string;
  subjectId: string | number;
}

export const AddQuestionModal: React.FC<AddQuestionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  type,
  subjectId,
}) => {
  const handleUpload = (uploadType: string) => {
    onSubmit(uploadType);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-md mx-auto"
      modalHeader={{
        hasHeader: true,
        modalTitle: "Add Question",
        style: "border-b",
      }}
    >
      <div className="py-8 px-6 sm:px-8">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Select Upload Type</h2>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            Choose whether youd like to upload questions individually or in bulk.
          </p>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Link href={`/dashboard/${type}/${subjectId}/questions/add`} className="w-full sm:w-auto">
            <button
              onClick={() => handleUpload("single")}
              className="w-full sm:w-40 py-2.5 sm:py-3 rounded-lg border border-gray-300 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium transition duration-200"
            >
              Single Upload
            </button>
          </Link>
          <button
            onClick={() => handleUpload("bulk")}
            className="w-full sm:w-40 py-2.5 sm:py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition duration-200"
          >
            Bulk Upload
          </button>
        </div>
      </div>
    </Modal>
  );
};

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (file: File | null) => void;
  subjectId: string | number;
  subjectType: string;
}

export const BulkUploadModal: React.FC<BulkUploadModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  subjectId,
  subjectType,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [createQuestions] = useCreateQuestionsMutation();
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);

    try {
      onSubmit(file); // optional external handler
      const parsed = await parseQuestionExcel(file, subjectId, subjectType);
      const response = await createQuestions(parsed).unwrap();

      if (response.status && response.data.inserted > 0) {
        Swal.fire("Success", "Questions uploaded successfully", "success").then(() => {
          router.push(`/dashboard/${subjectType}/${subjectId}/questions/drafts`); // ← adjust path if dynamic
        });
      } else {
        Swal.fire(
          "Partial Success",
          `${response.data.failed} question(s) failed`,
          "warning"
        );
        console.warn("Failures", response.data.failures);
      }

      onClose();
    } catch (err: any) {
      console.error(err);
      Swal.fire("Upload Failed", err?.message || "Unknown error", "error");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-md mx-auto"
      modalHeader={{
        hasHeader: true,
        modalTitle: "Bulk Upload",
        style: "border-b",
      }}
    >
      <div className="p-6 space-y-6">
        {/* Instruction Steps */}
        <div className="space-y-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-start gap-4">
              <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-gray-700 font-semibold">
                {step}
              </div>
              <div>
                {step === 1 && (
                  <>
                    <p className="text-gray-800">
                      Download the{" "}
                      <a
                        href="/question-bulk-template.xlsx"
                        className="text-blue-600 underline"
                        download
                      >
                        bulk upload template
                      </a>{" "}
                      to upload items
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Do not alter the structure. Fill in your data accordingly.
                    </p>
                  </>
                )}
                {step === 2 && (
                  <>
                    <p className="text-gray-800">Fill the template</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Follow the format shown in the instructions.
                    </p>
                  </>
                )}
                {step === 3 && (
                  <>
                    <p className="text-gray-800 mb-2">Upload your file</p>
                    <label className="flex items-center justify-center gap-2 px-4 py-4 border border-gray-300 rounded-md bg-gray-50 cursor-pointer hover:bg-gray-100 text-sm text-gray-700 w-full">
                      <FaUpload className="w-4 h-4" />
                      <span>{file ? file.name : "Select file..."}</span>
                      <input
                        type="file"
                        accept=".xlsx,.csv"
                        onChange={handleFileChange}
                        className="hidden w-100 w-full"
                      />
                    </label>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleUpload}
          disabled={!file || isUploading}
          className={`w-full py-3 rounded-lg transition-all duration-200 font-medium ${
            file
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isUploading ? (
            <span className="flex justify-center items-center gap-2">
              <Spinner /> Uploading...
            </span>
          ) : (
            "Bulk Upload"
          )}
        </button>
      </div>
    </Modal>
  );
};

interface EditDraftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (editedQuestion: Question) => void;
  question: Question | null;
}

interface Question {
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

export const EditDraftModal: React.FC<EditDraftModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  question,
}) => {
  const [editedQuestion, setEditedQuestion] = useState<Question | null>(question);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  useEffect(() => {
    setEditedQuestion(question);
    setImagePreview(question?.image || null);
  }, [isOpen, question]);

  type QuestionFieldValue =
  | string
  | number; // Expand if needed

  const handleFieldChange = (
    field: keyof Question,
    value: QuestionFieldValue,
    index?: number
  ) => {
    if (!editedQuestion) return;

    if (field === "options" && typeof index === "number") {
      const updatedOptions = [...editedQuestion.options];
      if (typeof value === "string") {
        updatedOptions[index] = value;
        setEditedQuestion({ ...editedQuestion, options: updatedOptions });
      }
    } else {
      setEditedQuestion({ ...editedQuestion, [field]: value });
    }
  };


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        if (editedQuestion) {
          setEditedQuestion({ ...editedQuestion, image: reader.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (editedQuestion) {
      onSubmit(editedQuestion);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="w-full max-w-md sm:max-w-xl lg:max-w-2xl mx-auto"
      modalHeader={{
        hasHeader: true,
        modalTitle: "Edit Question",
        style: "border-b",
      }}
    >
      <div className="overflow-y-auto max-h-[80vh]">
        <div className="p-6 space-y-3">
          {editedQuestion && (
            <>
              {/* Question Text */}
              <div>
                <Label htmlFor="questionText" className="block mb-2 text-sm">Question Text</Label>
                <Input
                  id="questionText"
                  name="questionText"
                  type="text"
                  value={editedQuestion.text}
                  onChange={(e) => handleFieldChange("text", e.target.value)}
                />
              </div>

              {/* Subject */}
              {editedQuestion.subject && (
                <div>
                  <Label htmlFor="subject" className="block mb-2 text-sm">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    value={editedQuestion.subject}
                    onChange={(e) => handleFieldChange("subject", e.target.value)}
                  />
                </div>
              )}

              {/* Topic */}
              {editedQuestion.topic && (
                <div>
                  <Label htmlFor="topic" className="block mb-2 text-sm">Topic</Label>
                  <Input
                    id="topic"
                    name="topic"
                    type="text"
                    value={editedQuestion.topic}
                    onChange={(e) => handleFieldChange("topic", e.target.value)}
                  />
                </div>
              )}

              {/* Year */}
              {editedQuestion.year && (
                <div>
                  <Label htmlFor="year" className="block mb-2 text-sm">Year</Label>
                  <Input
                    id="year"
                    name="year"
                    type="number"
                    value={editedQuestion.year}
                    onChange={(e) => handleFieldChange("year", Number(e.target.value))}
                  />
                </div>
              )}

              {/* Explanation */}
              {editedQuestion.explanation && (
                <div>
                  <Label htmlFor="explanation" className="block mb-2 text-sm">Explanation</Label>
                  <TextArea
                    id="explanation"
                    name="explanation"
                    value={editedQuestion.explanation}
                    onChange={(e) => handleFieldChange("explanation", e.target.value)}
                    rows={3}
                    className="text-gray-900 dark:text-white"
                  />
                </div>
              )}

              {/* Hint */}
                <div>
                  <Label htmlFor="hint" className="block mb-2 text-sm">Hint</Label>
                  <TextArea
                    id="hint"
                    name="hint"
                    value={editedQuestion.hint}
                    onChange={(e) => handleFieldChange("hint", e.target.value)}
                    rows={2}
                    className="text-gray-900 dark:text-white"
                  />
                </div>

              {/* Question Image */}
              {editedQuestion.image && (
                <div>
                  <Label className="block text-sm mb-2">Current Image</Label>
                  
                  <Image
                    src={imagePreview || ""}
                    alt="Question Image"
                    width={100}
                    height={40}
                    className="mb-3 rounded"
                  />

                </div>
              )}

              {/* Upload New Image */}
              <label htmlFor="newImage" className="block text-sm mb-2">Upload New Image (Optional)</label>
              
              <input
                type="file"
                className={`focus:border-ring-brand-300 h-11 w-full overflow-hidden rounded-lg border border-gray-300 bg-transparent text-sm text-gray-500 shadow-theme-xs transition-colors file:mr-5 file:border-collapse file:cursor-pointer file:rounded-l-lg file:border-0 file:border-r file:border-solid file:border-gray-200 file:bg-gray-50 file:py-3 file:pl-3.5 file:pr-3 file:text-sm file:text-gray-700 placeholder:text-gray-400 hover:file:bg-gray-100 focus:outline-hidden focus:file:ring-brand-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:text-white/90 dark:file:border-gray-800 dark:file:bg-white/[0.03] dark:file:text-gray-400 dark:placeholder:text-gray-400 `}
                onChange={handleImageChange}
              />

              {/* Options */}
              {editedQuestion.options.map((opt, idx) => (
                <div key={idx} className="mb-3">
                  <Label htmlFor={`option-${idx}`} className="block text-sm mb-1">Option {idx + 1}</Label>
                  <Input
                    id={`option-${idx}`}
                    name={`option-${idx}`}
                    type="text"
                    value={opt}
                    onChange={(e) => handleFieldChange("options", e.target.value, idx)}
                  />
                </div>
              ))}

              {/* Answer */}
              {editedQuestion.answer && (
                <div>
                  <Label htmlFor="answer" className="block mb-2 text-sm">Answer</Label>
                  <Input
                    id="answer"
                    name="answer"
                    type="text"
                    value={editedQuestion.answer}
                    onChange={(e) => handleFieldChange("answer", e.target.value)}
                  />
                </div>
              )}
            </>
          )}
          <div className="flex justify-end mt-4 space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

