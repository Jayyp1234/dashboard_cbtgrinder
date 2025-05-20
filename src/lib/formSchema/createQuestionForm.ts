import { z } from "zod";

export const QuestionSchema = z.object({
  question: z.string().min(10, "Question is too short"),
  options: z.array(z.string().min(1, "Option cannot be empty")).length(4, "Must have exactly 4 options"),
  correctAnswer: z.enum(["A", "B", "C", "D"], {
    errorMap: () => ({ message: "Correct answer is required" }),
  }),  
  hint: z.string().optional(),
  explanation: z.string().optional(),
  status: z.union([z.literal(1), z.literal(0)]).optional(),
  image: z.any().optional(),
  topic: z.string().min(1, "Topic is required"),
});

export const FormSchema = z.object({
  questions: z.array(QuestionSchema).min(1, "At least one question is required"),
});


export type FormSchemaType = z.infer<typeof FormSchema>;