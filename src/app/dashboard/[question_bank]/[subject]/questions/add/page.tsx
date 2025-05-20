"use client";

import React, { useState, useRef, useCallback } from "react";
import Select from "@/components/form/Select";
import { YearPickerModal } from "@/components/ui/modals/allModal";
import Label from "@/components/form/Label";
import { ArrowRightIcon, ChevronDownIcon } from "@/icons";
import TextArea from "@/components/form/input/TextArea";
import Swal from "sweetalert2"; // Make sure SweetAlert2 is installed
import { useRouter } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useCreateQuestionsMutation, useGetSubjectTopicsQuery } from "@/lib/services/questionBank";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormSchema, FormSchemaType } from "@/lib/formSchema/createQuestionForm"; // wherever you save the schema

// Dynamically import the wrapped editor
const QuillEditor = dynamic(() => import('@/components/form/Rte'), {
  ssr: false,
});


const answerOptions = [
  { value: "A", label: "A" },
  { value: "B", label: "B" },
  { value: "C", label: "C" },
  { value: "D", label: "D" },
];

export interface QuestionInput {
  type: string;
  subject: string;
  topic: string;
  question_text: string;
  rendered_text?: string | null;
  format?: string;
  question_image?: string | null;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
  hint?: string;
  explanation?: string;
  year: number;
  status: number | string;
}

export default function QuestionBank() {
  const router = useRouter();
  const [isYearModalOpen, setIsYearModalOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const imageInputRefs = useRef<Record<number, HTMLInputElement | null>>({});



  const {
    control,
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      questions: [
        {
          question: "",
          options: ["", "", "", ""],
          correctAnswer: "A",
          hint: "",
          explanation: "",
          status: 1,
          image: null,
          topic: "",
        },
      ],
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "questions",
  });



  //Getting the subject topics
  const params = useParams();
  const type = params?.question_bank?.toString().toUpperCase() || "JAMB";
  const subject = params?.subject?.toString() || "";
  const { data: topics } = useGetSubjectTopicsQuery({ subjectId: subject, subjectType: type });
  const formattedTopics = [
    { value: "all", label: "All" },
    ...(topics?.data?.map((topic: { name: string }) => ({
      value: topic.name,
      label: topic.name,
    })) || [])
  ];

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string); // base64 string
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const setImageInputRef = useCallback(
    (index: number) => (el: HTMLInputElement | null) => {
      imageInputRefs.current[index] = el;
    },
    []
  );
  

  // const handleAddQuestion = () => {
  //   append({
  //     question: "",
  //     options: ["", "", "", ""],
  //     correctAnswer: "A",
  //     hint: "",
  //     explanation: "",
  //     status: 1,
  //     image: null,
  //     topic: "",
  //   });
  // };

  const [createQuestions, { isLoading }] = useCreateQuestionsMutation();

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (!selectedYear) {
      Swal.fire("Missing Year", "Please select a year.", "warning");
      return;
    }

    try {
      const payload = await Promise.all(
        data.questions.map(async (q) => {
          const base64Image = q.image
            ? await fileToBase64(q.image as File)
            : null;

          return {
            ...q,
            year: selectedYear,
            type: type,
            subject: subject,
            rendered_text: q.question,
            format: "html",
            question_text: q.question,
            question_image: base64Image,
            option_a: q.options[0],
            option_b: q.options[1],
            option_c: q.options[2],
            option_d: q.options[3],
            correct_option: q.correctAnswer.toLowerCase(),
          };
        })
      );

      const res = await createQuestions(payload).unwrap();

      if (res.status && res.data.inserted > 0) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: 'Questions uploaded successfully', //res?.text
        });

        // ✅ Reset form
        reset({
          questions: [
            {
              question: "",
              options: ["", "", "", ""],
              correctAnswer: "A",
              hint: "",
              explanation: "",
              status: 1,
              image: null,
              topic: "",
            },
          ],
        });

        setSelectedYear(null);
      } else {
        Swal.fire({
          icon: "warning",
          title: "Some questions failed",
          text: `${res.data.failed} question(s) failed. Check console for details.`,
        });
        console.warn("Failures", res.data.failures);
      }
    } catch (err: unknown) {
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: err instanceof Error ? err.message : "Something went wrong",
      });
      console.error("Error uploading questions:", err);
    }
  };




  return (
    <>
      <div className="mb-3">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 ">
          <ArrowRightIcon className="rotate-180" />
          <span>Back</span>
        </button>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="bg-[#F9FBFF] dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-6 rounded-lg shadow-md">
        <h1 className="text-xl font-semibold capitalize mb-6">Set Questions</h1>



        {/* Meta Fields */}
        <div className="grid grid-cols-1  mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Year</label>
            <input
              type="text"
              readOnly
              value={selectedYear || ""}
              onClick={() => setIsYearModalOpen(true)}
              placeholder="Select year"
              className="w-full px-4 py-2.5 border rounded-md cursor-pointer bg-white dark:bg-gray-800 dark:border-gray-700 focus:outline-none"
            />
          </div>



        </div>

        {/* Questions */}
        {fields.map((q, index) => (


          <div key={index} className="mb-8 border-t pt-6">
            {/* Image Upload */}
            <div className="mb-4">
              <Label>Image</Label>

              {/* File input */}
              <input
                type="file"
                accept="image/*"
                ref={setImageInputRef(index)}
                onChange={(e) =>
                  setValue(`questions.${index}.image`, e.target.files?.[0] || null)
                }
                className="w-full p-3 rounded-md border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-black dark:text-white"
              />

              {/* Image preview with cancel button */}
              {watch(`questions.${index}.image`) &&
                typeof watch(`questions.${index}.image`) !== "string" && (
                  <div className="relative mt-3 w-fit">
                    <Image
                      src={URL.createObjectURL(watch(`questions.${index}.image`))}
                      alt={`Preview ${index}`}
                      className="h-32 rounded border"
                      width={128}
                      height={128}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setValue(`questions.${index}.image`, null);
                        if (imageInputRefs.current[index]) {
                          imageInputRefs.current[index].value = "";
                        }
                      }}
                      className="absolute top-0 right-0 bg-red-600 text-white text-xs px-2 py-1 rounded-tr-md rounded-bl-md hover:bg-red-700 transition"
                    >
                      ✕ Cancel
                    </button>
                  </div>
                )}
            </div>

            {/* Topic Selector */}
            <div className="mb-4">
              <Label>Select Topic</Label>
              <div className="relative">
                <Select
                  options={formattedTopics}
                  value={watch(`questions.${index}.topic`) || ""}
                  onChange={(val) =>
                    setValue(`questions.${index}.topic`, val, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                  className="border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                  placeholder="Select topic..."
                />

                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 pointer-events-none">
                  <ChevronDownIcon />
                </span>
              </div>
              {errors.questions?.[index]?.topic && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.questions[index]?.topic?.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <Label>Question {index + 1}</Label>

              <QuillEditor
                editorKey={index} // 💡 ensures new instance on append
                value={watch(`questions.${index}.question`)}
                onChange={(val) => setValue(`questions.${index}.question`, val)}
              />
              <br /><br />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 mt-5">
              {["A", "B", "C", "D"].map((label, optIdx) => (
                <div key={label}>
                  <Label>{label}</Label>
                  <input
                    type="text"
                    placeholder={`Enter answer for ${label}`}
                    {...register(`questions.${index}.options.${optIdx}`, {
                      required: "Option cannot be empty",
                      minLength: {
                        value: 1,
                        message: "Option cannot be empty",
                      },
                    })}
                    className="w-full p-3 rounded-md border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-black dark:text-white"
                  />
                  {errors.questions?.[index]?.options?.[optIdx] && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.questions[index].options?.[optIdx]?.message}
                    </p>
                  )}
                </div>
              ))}
            </div>



            <div className="mb-4">
              <Label>Select Correct Answer</Label>
              <Select
                options={answerOptions}
                value={watch(`questions.${index}.correctAnswer`) || ""}
                onChange={(val) =>
                  setValue(`questions.${index}.correctAnswer`, val as "A" | "B" | "C" | "D", {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                
                className="border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                placeholder="Select correct answer..."
              />
              {errors.questions?.[index]?.correctAnswer && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.questions[index]?.correctAnswer?.message}
                </p>
              )}
            </div>


            {/* Hint */}
            <div className="mb-4">
              <Label>Hint</Label>
              <input
                type="text"
                placeholder="Enter hint"
                {...register(`questions.${index}.hint`)}
                className="w-full p-3 rounded-md border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-black dark:text-white"
              />
              {errors.questions?.[index]?.hint && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.questions[index].hint?.message}
                </p>
              )}
            </div>

            {/* Explanation */}
            <div className="mb-4">
              <Label>Explanation</Label>
              <TextArea
                placeholder="Enter explanation"
                {...register(`questions.${index}.explanation`)}
                className="w-full p-3 rounded-md border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-black dark:text-white"
                rows={4}
              />
              {errors.questions?.[index]?.explanation && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.questions[index].explanation?.message}
                </p>
              )}
            </div>


            <div className="mb-4">
              <Label>Status</Label>
              <select
                className="h-11 w-full appearance-none rounded-lg border px-4 py-2.5 pr-11 text-sm shadow-sm 
      placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500
      dark:bg-gray-900 dark:text-white dark:border-gray-700 border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                value={watch(`questions.${index}.status`) ?? ""}
                onChange={(e) =>
                  setValue(`questions.${index}.status`, parseInt(e.target.value) as 0 | 1, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })                  
                }
              >
                <option value="" disabled>
                  Select status...
                </option>
                <option value="1">Publish</option>
                <option value="0">Drafts</option>
              </select>

              {errors.questions?.[index]?.status && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.questions[index]?.status?.message}
                </p>
              )}
            </div>


          </div>
        ))}

        {/* Buttons */}
        <div className="flex gap-4">
          {/* <button
            onClick={handleAddQuestion}
            className="border border-blue-700 text-blue-700 text-sm px-6 py-2 rounded-md transition hover:bg-blue-700 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white"
          >
            Add Question
          </button> */}
          <button
            type="submit"
            disabled={isLoading}
            className={`flex items-center justify-center gap-2 bg-blue-700 text-white text-sm px-6 py-2 rounded-md transition ${
              isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-800"
            }`}
          >
            {isLoading && (
              <svg
                className="animate-spin h-4 w-4 text-white"
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
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            )}
            {isLoading ? "Saving..." : "Save Question"}
          </button>
        </div>

        {/* Year Picker Modal */}
        <YearPickerModal
          isOpen={isYearModalOpen}
          onClose={() => setIsYearModalOpen(false)}
          onSelectYear={(year) => {
            setSelectedYear(year);
            setIsYearModalOpen(false);
          }}
          initialYear={selectedYear || undefined}
        />
      </form>
    </>
  );
}
