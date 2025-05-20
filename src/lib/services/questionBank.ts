import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Author {
  value: number;
  label: string;
  email: string;
}

export interface AuthorsResponse {
  status: boolean;
  text: string;
  data: Author[];
  time: string;
  method: string;
  endpoint: string;
  error: any[];  // 
}

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
  status?: number;
}


export const questionBank = createApi({
  reducerPath: 'questionBankApi',
  tagTypes: ['Question'],
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://cbtgrinder.com/api/dashboard/',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
        headers.set('X-Api-Key',`Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getSubjectCategories: builder.query<any, // 
    { type: string }>({
      query: ({ type }) => `user/get_subject_categories.php?type=${type}`,
    }),
    getSubjectTopics: builder.query<any, // 
    { subjectId: string; subjectType: string }>({
      query: ({ subjectId, subjectType }) =>
        `user/get_subject_topics.php?subject_id=${encodeURIComponent(subjectId)}&subject_type=${encodeURIComponent(subjectType)}`,
    }),  
    getQuestionAuthors: builder.query({
      query: () => ({
        url: "/user/get_question_authors.php",
        method: "GET",
      }),
    }),  
    createSubjectTopic: builder.mutation<any, // 
     { name: string; subject_id: string; subject_type: string }>({
      query: (body) => ({
        url: 'user/create_subject_topic.php',
        method: 'POST',
        body,
      }),
    }),
    deleteSubjectTopic: builder.mutation<
      { status: boolean; text: string; data: any },
      { topic_id: number }
    >({
      query: ({ topic_id }) => ({
        url: `user/delete_subject_topic.php?topic_id=${topic_id}`,
        method: 'DELETE',
      }),
      // If you want to refresh topics after deletion
      invalidatesTags: ['Question'],
    }),
    deleteQuestion: builder.mutation<any,  // 
    { question_id: number }>({
      query: (body) => ({
        url: 'user/delete_question.php',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Question'], // ✅ this is the correct property for mutations
    }),    
    
    createQuestions: builder.mutation<{ status: boolean; message: string; data: any // 
     }, QuestionInput[] >({
      query: (questions) => ({
        url: 'user/create_question.php',
        method: 'POST',
        body: questions,
      }),
    }),

      getQuestions: builder.query<any,{
        page?: number;
        limit?: number;
        type?: string;
        subject?: string;
        topic?: string;
        status?: string;
        year?: string;
        is_flagged?: string;
        sort_by?: string;
        search?: string;
        sort_order?: 'asc' | 'desc';
      }>({
        query: (params) => {
          const query = new URLSearchParams();
          if (params.page) query.append('page', params.page.toString());
          if (params.type) query.append('type', params.type);
          if (params.limit) query.append('limit', params.limit.toString());
          if (params.subject) query.append('subject', params.subject);
          if (params.topic) query.append('topic', params.topic);
          if (params.status) query.append('status', params.status);
          if (params.year) query.append('year', params.year);
          if (params.is_flagged) query.append('is_flagged', params.is_flagged);
          if (params.sort_by) query.append('sort_by', params.sort_by);
          if (params.sort_order) query.append('sort_order', params.sort_order);
          if (params.search) query.append('search', params.search);
      
          return `user/get_questions.php?${query.toString()}`;
        },
        providesTags: ['Question'], // ✅ this will keep the query tag updated
      }),
      bulkUpdateQuestionStatus: builder.mutation<
        { status: boolean; text: string; data: any },
        { ids: number[]; status: number }
      >({
        query: (body) => ({
          url: 'user/update_question_status.php',
          method: 'POST',
          body,
        }),
        invalidatesTags: ['Question'], // optional if you want to refresh question list
      }),
      bulkDeleteQuestionStatus: builder.mutation<
        { status: boolean; text: string; data: any },
        { ids: number[]}
      >({
        query: (body) => ({
          url: 'user/delete_bulk_question.php',
          method: 'POST',
          body,
        }),
        invalidatesTags: ['Question'], // optional if you want to refresh question list
      }),
      editQuestion: builder.mutation<
        { status: boolean; title: string; detail: string; data?: any },
        { id: number } & Partial<QuestionInput>
      >({
        query: (body) => ({
          url: 'user/edit_question.php', // ✅ Match the actual PHP file
          method: 'POST',                // ✅ POST or PUT depending on your backend
          body,
        }),
        invalidatesTags: ['Question'],
      }),


      
      
    }),

    
  })

export const {
  useGetSubjectCategoriesQuery,
  useGetSubjectTopicsQuery,
  useGetQuestionAuthorsQuery,
  useCreateSubjectTopicMutation,
  useDeleteSubjectTopicMutation,
  useDeleteQuestionMutation,
  useCreateQuestionsMutation, 
  useGetQuestionsQuery,
  useBulkUpdateQuestionStatusMutation,
  useBulkDeleteQuestionStatusMutation,
  useEditQuestionMutation,
} = questionBank;
