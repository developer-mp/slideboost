import { createApi } from "@reduxjs/toolkit/query/react";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { config } from "../../../env.config";
import { FileWithMetadata } from "../../interfaces/interfaces";

type AxiosBaseQueryArgs = {
  url: string;
  method?: AxiosRequestConfig["method"];
  data?: unknown;
  params?: unknown;
  responseType?: AxiosRequestConfig["responseType"];
};

const axiosBaseQuery =
  ({ baseUrl }: { baseUrl: string } = { baseUrl: "" }) =>
  async ({
    url,
    method = "GET",
    data,
    params,
    responseType,
  }: AxiosBaseQueryArgs) => {
    try {
      const requestUrl = /^https?:\/\//.test(url) ? url : `${baseUrl}${url}`;

      const result = await axios({
        url: requestUrl,
        method,
        data,
        params,
        responseType,
        withCredentials: true,
      });

      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError<{
        message?: string;
        requestCode?: boolean;
      }>;

      return {
        error: {
          status: err.response?.status,
          data: {
            message: err.response?.data?.message || err.message,
            requestCode: err.response?.data?.requestCode || false,
          },
        },
      };
    }
  };

type FileDescriptor = { file_id: string; file_type: string };

const buildFormData = (files: FileWithMetadata[]) => {
  const formData = new FormData();
  let folder = "media";

  files.forEach((item) => {
    if (
      item.file.type === "application/vnd.ms-powerpoint" ||
      item.file.name.endsWith(".pptx") ||
      item.file.name.endsWith(".ppt")
    ) {
      folder = "templates";
    }

    formData.append("file", item.file);

    if (item.category !== null) {
      formData.append("category", item.category);
    }
  });

  return { formData, folder };
};

export const appApi = createApi({
  reducerPath: "appApi",
  baseQuery: axiosBaseQuery({
    baseUrl: `${config.API_BASE_URL}${config.API}${config.API_VERSION}`,
  }),
  tagTypes: ["Data", "Storage", "User", "Payment", "Ppt"],
  endpoints: (builder) => ({
    getTemplateCategories: builder.query<{ data: []; message: string }, void>({
      query: () => ({
        url: `${config.DATA_ROUTER}${config.TEMPLATES_ENDPOINT}`,
      }),
      providesTags: ["Data"],
    }),
    getDeactivationReasons: builder.query<{ data: []; message: string }, void>({
      query: () => ({
        url: `${config.DATA_ROUTER}${config.DEACTIVATION_REASONS_ENDPOINT}`,
      }),
      providesTags: ["Data"],
    }),
    getSupportedFiles: builder.query<{ data: []; message: string }, void>({
      query: () => ({
        url: `${config.DATA_ROUTER}${config.SUPPORTED_FILES_ENDPOINT}`,
      }),
      providesTags: ["Data"],
    }),
    getFaq: builder.query<{ data: []; message: string }, void>({
      query: () => ({
        url: `${config.DATA_ROUTER}${config.FAQ_ENDPOINT}`,
      }),
      providesTags: ["Data"],
    }),
    getNews: builder.query<{ data: []; message: string }, void>({
      query: () => ({
        url: `${config.DATA_ROUTER}${config.NEWS_ENDPOINT}`,
      }),
      providesTags: ["Data"],
    }),

    registerUser: builder.mutation<
      { name: string; email: string; message: string },
      { name: string; email: string; password: string }
    >({
      query: ({ name, email, password }) => ({
        url: `${config.USER_ROUTER}${config.REGISTER_ENDPOINT}`,
        method: "POST",
        data: { name, email, password },
      }),
      invalidatesTags: ["User"],
    }),
    verifyEmail: builder.mutation<
      { message: string },
      { email: string; code: string }
    >({
      query: ({ email, code }) => ({
        url: `${config.USER_ROUTER}${config.VERIFY_ENDPOINT}`,
        method: "POST",
        data: { email, code },
      }),
    }),
    loginUser: builder.mutation<
      {
        id: string;
        name: string;
        email: string;
        createdAt: string;
        surveySent: boolean;
        message: string;
      },
      { email: string; password: string }
    >({
      query: ({ email, password }) => ({
        url: `${config.USER_ROUTER}${config.LOGIN_ENDPOINT}`,
        method: "POST",
        data: { email, password },
      }),
      invalidatesTags: ["User"],
    }),
    loginUserWithGoogle: builder.mutation<
      {
        id: string;
        name: string;
        email: string;
        createdAt: string;
        surveySent: boolean;
        message: string;
      },
      { idToken: string }
    >({
      query: ({ idToken }) => ({
        url: `${config.USER_ROUTER}${config.LOGIN_GOOGLE_ENDPOINT}`,
        method: "POST",
        data: { idToken },
      }),
      invalidatesTags: ["User"],
    }),
    logoutUser: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: `${config.USER_ROUTER}${config.LOGOUT_ENDPOINT}`,
        method: "POST",
        data: {},
      }),
      invalidatesTags: ["User"],
    }),
    verifyToken: builder.query<{ userId: string }, void>({
      query: () => ({
        url: `${config.USER_ROUTER}${config.VERIFY_TOKEN_ENDPOINT}`,
      }),
      providesTags: ["User"],
    }),
    refreshToken: builder.mutation<{ userId: string }, { email: string }>({
      query: ({ email }) => ({
        url: `${config.USER_ROUTER}${config.REFRESH_TOKEN_ENDPOINT}`,
        method: "POST",
        data: { email },
      }),
      invalidatesTags: ["User"],
    }),
    sendEmail: builder.mutation<
      { message: string; email: string },
      { email: string; template: string; subject: string }
    >({
      query: ({ email, template, subject }) => ({
        url: `${config.USER_ROUTER}${config.EMAIL_ENDPOINT}`,
        method: "POST",
        data: { email, template, subject },
      }),
      invalidatesTags: ["User"],
    }),
    updateUserName: builder.mutation<
      { name: string; message: string },
      { name: string; email: string }
    >({
      query: ({ name, email }) => ({
        url: `${config.USER_ROUTER}${config.USER_ENDPOINT}`,
        method: "POST",
        data: { name, email },
      }),
      invalidatesTags: ["User"],
    }),
    updatePassword: builder.mutation<
      { message: string },
      { password: string; email: string }
    >({
      query: ({ password, email }) => ({
        url: `${config.USER_ROUTER}${config.PASSWORD_ENDPOINT}`,
        method: "POST",
        data: { password, email },
      }),
      invalidatesTags: ["User"],
    }),
    deactivateAccount: builder.mutation<
      { message: string },
      { email: string; reason: string; details: string }
    >({
      query: ({ email, reason, details }) => ({
        url: `${config.USER_ROUTER}${config.DEACTIVATION_ENDPOINT}`,
        method: "POST",
        data: { email, reason, details },
      }),
      invalidatesTags: ["User"],
    }),
    getCreditBalance: builder.query<
      { creditBalance: number },
      { userId: string }
    >({
      query: ({ userId }) => ({
        url: `${config.USER_ROUTER}${config.BALANCE_ENDPOINT}`,
        params: { userId },
      }),
      providesTags: ["User"],
    }),
    sendContactForm: builder.mutation<
      { message: string },
      { formData: { name: string; email: string; message: string } }
    >({
      query: ({ formData }) => ({
        url: `${config.USER_ROUTER}${config.CONTACT_FORM_ENDPOINT}`,
        method: "POST",
        data: { formData },
      }),
      invalidatesTags: ["User"],
    }),
    sendSurvey: builder.mutation<
      { message: string },
      { userId: string; surveyData: { [key: string]: string | boolean | null } }
    >({
      query: ({ userId, surveyData }) => ({
        url: `${config.USER_ROUTER}${config.SURVEY_ENDPOINT}`,
        method: "POST",
        data: { userId, surveyData },
      }),
      invalidatesTags: ["User"],
    }),

    uploadFile: builder.mutation<
      { message: string },
      { file: FileWithMetadata[]; userId: string }
    >({
      query: ({ file, userId }) => {
        const { formData, folder } = buildFormData(file);

        return {
          url: `${config.STORAGE_ROUTER}${config.UPLOAD_ENDPOINT}`,
          method: "POST",
          data: formData,
          params: { userId, folder },
        };
      },
      invalidatesTags: ["Storage"],
    }),
    getFileMetadata: builder.query<
      { data: []; message: string },
      { userId: string }
    >({
      query: ({ userId }) => ({
        url: `${config.STORAGE_ROUTER}${config.METADATA_ENDPOINT}`,
        params: { userId },
      }),
      providesTags: ["Storage"],
    }),
    deleteFile: builder.mutation<
      { message: string },
      { fileId: string; fileName: string }
    >({
      query: ({ fileId, fileName }) => ({
        url: `${config.STORAGE_ROUTER}${config.DELETE_ENDPOINT}`,
        method: "POST",
        params: { fileId, fileName },
      }),
      invalidatesTags: ["Storage"],
    }),
    downloadFile: builder.query<
      { data: { data: number[]; type: string }; message: string },
      { fileId: string }
    >({
      query: ({ fileId }) => ({
        url: `${config.STORAGE_ROUTER}${config.DOWNLOAD_ENDPOINT}`,
        params: { fileId },
      }),
    }),

    createCheckout: builder.mutation<
      { url: string },
      { amount: number; userId: string }
    >({
      query: ({ amount, userId }) => ({
        url: `${config.PAYMENT_ROUTER}${config.CHECKOUT_ENDPOINT}`,
        method: "POST",
        data: { amount, userId },
      }),
      invalidatesTags: ["Payment", "User"],
    }),
    verifyPayment: builder.mutation<
      { paid: boolean; message: string },
      { sessionId: string; credits: number; userId: string }
    >({
      query: ({ sessionId, credits, userId }) => ({
        url: `${config.PAYMENT_ROUTER}${config.VERIFY_PAYMENT_ENDPOINT}`,
        method: "POST",
        data: { sessionId, credits, userId },
      }),
      invalidatesTags: ["Payment", "User"],
    }),

    calculateTokens: builder.query<
      {
        tokenCount: number;
        tokenPerCredit: number;
        tokenLimit: number;
        message: string;
      },
      { userId: string; files: FileDescriptor[] }
    >({
      query: ({ userId, files }) => ({
        url: `${config.PPT_ROUTER}${config.COUNT_TOKENS_ENDPOINT}`,
        params: { userId, files },
      }),
      providesTags: ["Ppt"],
    }),
    generatePpt: builder.query<
      { message: string },
      {
        userId: string;
        files: FileDescriptor[];
        templateId: string;
        title: string;
        credits: number;
      }
    >({
      query: ({ userId, files, templateId, title, credits }) => ({
        url: `${config.PPT_ROUTER}${config.PPT_ENDPOINT}`,
        params: { userId, files, templateId, title, credits },
      }),
      providesTags: ["Ppt", "Storage", "User"],
    }),
    uploadPowerPointTemplate: builder.mutation<Blob, FormData>({
      query: (formData) => ({
        url: `${config.API_BASE_URL}${config.UPLOAD_ENDPOINT}`,
        method: "POST",
        data: formData,
        responseType: "blob",
      }),
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useVerifyEmailMutation,
  useLoginUserMutation,
  useLoginUserWithGoogleMutation,
  useLogoutUserMutation,
  useLazyVerifyTokenQuery,
  useRefreshTokenMutation,
  useSendEmailMutation,
  useUpdateUserNameMutation,
  useUpdatePasswordMutation,
  useDeactivateAccountMutation,
  useLazyGetCreditBalanceQuery,
  useSendContactFormMutation,
  useSendSurveyMutation,
  useUploadFileMutation,
  useLazyGetFileMetadataQuery,
  useDeleteFileMutation,
  useLazyDownloadFileQuery,
  useCreateCheckoutMutation,
  useVerifyPaymentMutation,
  useLazyCalculateTokensQuery,
  useLazyGeneratePptQuery,
  useUploadPowerPointTemplateMutation,
  useLazyGetTemplateCategoriesQuery,
  useLazyGetDeactivationReasonsQuery,
  useLazyGetSupportedFilesQuery,
  useLazyGetFaqQuery,
  useLazyGetNewsQuery,
} = appApi;
