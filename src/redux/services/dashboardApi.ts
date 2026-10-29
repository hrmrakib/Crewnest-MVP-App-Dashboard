import { apiSlice } from "./apiSlice";
import type {
  AdminOverview,
  DashboardUserList,
  AdminUserList,
  AdminUserDetail,
  UserActionRequest,
  UserActionResponse,
  GetUsersParams,
  GetAdminUsersParams,
  PaginatedResponse,
  Booking,
  Notification,
  SuccessResponse,
  FAQ,
  FAQRequest,
  SupportTicket,
  UpdateTicketStatusRequest,
  AppDocument,
  AppDocumentRequest,
  AboutUs,
  PrivacyPolicy,
  TermsCondition,
  ListingItem,
  Payment,
  LandlordWallet,
  WithdrawRequest,
  WithdrawRequestRequest,
  WithdrawAdminActionRequest,
  DocumentSlug,
} from "../types/api.types";

export const dashboardApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // ─── Admin Overview ────────────────────────────────────────────────────────
    getAdminOverview: builder.query<AdminOverview, void>({
      query: () => "v1/dashboard/overview/",
      transformResponse: (response: any): AdminOverview => {
        const data = response?.data ?? response;
        const parseIfString = (val: any) => {
          if (typeof val === "string") {
            try { return JSON.parse(val); } catch { return val; }
          }
          return val;
        };

        return {
          overview: parseIfString(data?.overview) ?? {
            total_users: 0,
            active_listings: 0,
            total_bookings: 0,
            total_revenue: 0,
          },
          growth: parseIfString(data?.growth) ?? { monthly: [], yearly: [] },
          roles: parseIfString(data?.roles) ?? {},
          latest_bookings: Array.isArray(parseIfString(data?.latest_bookings))
            ? parseIfString(data?.latest_bookings)
            : [],
          new_users: Array.isArray(parseIfString(data?.new_users))
            ? parseIfString(data?.new_users)
            : [],
        };
      },
      providesTags: ["Dashboard"],
    }),

    getDashboardOverview: builder.query<AdminOverview, void>({
      query: () => "v1/dashboard/overview/",
      transformResponse: (response: any): AdminOverview => {
        const data = response?.data ?? response;
        const parseIfString = (val: any) => {
          if (typeof val === "string") {
            try { return JSON.parse(val); } catch { return val; }
          }
          return val;
        };

        return {
          overview: parseIfString(data?.overview) ?? {
            total_users: 0,
            active_listings: 0,
            total_bookings: 0,
            total_revenue: 0,
          },
          growth: parseIfString(data?.growth) ?? { monthly: [], yearly: [] },
          roles: parseIfString(data?.roles) ?? {},
          latest_bookings: Array.isArray(parseIfString(data?.latest_bookings))
            ? parseIfString(data?.latest_bookings)
            : [],
          new_users: Array.isArray(parseIfString(data?.new_users))
            ? parseIfString(data?.new_users)
            : [],
        };
      },
      providesTags: ["Dashboard"],
    }),

    // ─── Admin Notifications ───────────────────────────────────────────────────
    getAdminNotifications: builder.query<Notification[], void>({
      query: () => "v1/admin/notifications/",
      providesTags: ["Notifications"],
    }),

    deleteAdminNotification: builder.mutation<void, number>({
      query: (id) => ({
        url: `v1/admin/notifications/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notifications"],
    }),

    clearAllAdminNotifications: builder.mutation<void, void>({
      query: () => ({
        url: "v1/admin/notifications/clear-all/",
        method: "DELETE",
      }),
      invalidatesTags: ["Notifications"],
    }),

    // ─── Admin Users ───────────────────────────────────────────────────────────
    getAdminUsers: builder.query<PaginatedResponse<AdminUserList>, GetAdminUsersParams>({
      query: ({ page, page_size } = {}) => ({
        url: "v1/admin/users/",
        params: { page, page_size },
      }),
      providesTags: ["Users"],
    }),

    getAdminUserDetail: builder.query<AdminUserDetail, string>({
      query: (userId) => `v1/admin/users/${userId}/`,
      providesTags: (_result, _err, id) => [{ type: "Users", id }],
    }),

    toggleUserStatus: builder.mutation<{ success: boolean; message: string }, string>({
      query: (userId) => ({
        url: `v1/admin/users/${userId}/toggle-status/`,
        method: "POST",
      }),
      invalidatesTags: ["Users"],
    }),

    // ─── Dashboard Users ───────────────────────────────────────────────────────
    getDashboardUsers: builder.query<DashboardUserList[], GetUsersParams>({
      query: ({ search, status } = {}) => ({
        url: "v1/dashboard/users/",
        params: { search, status },
      }),
      transformResponse: (response: unknown): DashboardUserList[] => {
        if (Array.isArray(response)) return response;
        if (response && typeof response === "object" && "results" in response) {
          const res = (response as { results: unknown }).results;
          if (Array.isArray(res)) return res as DashboardUserList[];
        }
        return [];
      },
      providesTags: ["Users"],
    }),

    getDashboardUserDetail: builder.query<
      { success: boolean; message: string },
      { userId: string; booking_status?: "completed" | "ongoing" | "upcoming" }
    >({
      query: ({ userId, booking_status }) => ({
        url: `v1/dashboard/users/${userId}/`,
        params: { booking_status },
      }),
      providesTags: (_result, _err, { userId }) => [{ type: "Users", id: userId }],
    }),

    deleteUser: builder.mutation<{ success: boolean; message: string }, string>({
      query: (userId) => ({
        url: `v1/dashboard/users/${userId}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),

    userAction: builder.mutation<UserActionResponse, { userId: string; data: UserActionRequest }>({
      query: ({ userId, data }) => ({
        url: `v1/dashboard/users/${userId}/action/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),

    // ─── Bookings ──────────────────────────────────────────────────────────────
    getBookings: builder.query<PaginatedResponse<Booking>, { page?: number }>({
      query: ({ page } = {}) => ({
        url: "v1/booking/",
        params: { page },
      }),
      providesTags: ["Bookings"],
    }),

    getBookingDetail: builder.query<Booking, number>({
      query: (id) => `v1/booking/${id}/`,
      providesTags: (_result, _err, id) => [{ type: "Bookings", id }],
    }),

    // ─── Notifications (user) ──────────────────────────────────────────────────
    getNotifications: builder.query<Notification[], void>({
      query: () => "v1/notification/",
      providesTags: ["Notifications"],
    }),

    deleteNotification: builder.mutation<SuccessResponse, number>({
      query: (id) => ({
        url: `v1/notification/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notifications"],
    }),

    clearAllNotifications: builder.mutation<SuccessResponse, void>({
      query: () => ({
        url: "v1/notification/clear-all/",
        method: "DELETE",
      }),
      invalidatesTags: ["Notifications"],
    }),

    // ─── FAQ ──────────────────────────────────────────────────────────────────
    getFAQs: builder.query<FAQ[], { user_type?: "landlord" | "renter" }>({
      query: ({ user_type } = {}) => ({
        url: "v1/faq/",
        params: { user_type },
      }),
      transformResponse: (response: any): FAQ[] => {
        if (Array.isArray(response)) return response;
        if (Array.isArray(response?.data)) return response.data;
        if (Array.isArray(response?.results)) return response.results;
        return [];
      },
      providesTags: ["FAQs"],
    }),

    createFAQ: builder.mutation<FAQ, FAQRequest>({
      query: (data) => ({
        url: "v1/faq/",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: any): FAQ => {
        return response?.data ?? response;
      },
      invalidatesTags: ["FAQs"],
    }),

    updateFAQ: builder.mutation<FAQ, { id: number; data: FAQRequest }>({
      query: ({ id, data }) => ({
        url: `v1/faq/${id}/`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: any): FAQ => {
        return response?.data ?? response;
      },
      invalidatesTags: ["FAQs"],
    }),

    deleteFAQ: builder.mutation<SuccessResponse, number>({
      query: (id) => ({
        url: `v1/faq/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["FAQs"],
    }),

    // ─── Support Tickets ────────────────────────────────────────────────────────
    getSupportTickets: builder.query<SupportTicket[], void>({
      query: () => "v1/support/tickets/",
      transformResponse: (response: any): SupportTicket[] => {
        if (Array.isArray(response)) return response;
        if (Array.isArray(response?.data)) return response.data;
        if (Array.isArray(response?.results)) return response.results;
        return [];
      },
      providesTags: ["Support"],
    }),

    updateTicketStatus: builder.mutation<SupportTicket, { id: number; data: UpdateTicketStatusRequest }>({
      query: ({ id, data }) => ({
        url: `v1/support/tickets/${id}/status/`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: (response: any): SupportTicket => {
        return response?.data ?? response;
      },
      invalidatesTags: ["Support"],
    }),

    // ─── App Documents (About, Privacy, Terms) ─────────────────────────────────
    getDocument: builder.query<AppDocument, DocumentSlug>({
      query: (slug) => `v1/basic_info/api/docs/${slug}/`,
      providesTags: (_result, _err, slug) => [{ type: "Documents", id: slug }],
    }),

    upsertDocument: builder.mutation<AppDocument, { slug: DocumentSlug; data: AppDocumentRequest }>({
      query: ({ slug, data }) => ({
        url: `v1/basic_info/api/docs/${slug}/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_result, _err, { slug }) => [{ type: "Documents", id: slug }],
    }),

    updateDocument: builder.mutation<AppDocument, { slug: DocumentSlug; data: AppDocumentRequest }>({
      query: ({ slug, data }) => ({
        url: `v1/basic_info/api/docs/${slug}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _err, { slug }) => [{ type: "Documents", id: slug }],
    }),

    // ─── Dashboard Policy Endpoints ─────────────────────────────────────────────
    getAboutUs: builder.query<AboutUs[], void>({
      query: () => "v1/dashboard/about-us/",
      transformResponse: (response: any): AboutUs[] => {
        if (Array.isArray(response)) return response;
        if (Array.isArray(response?.data)) return response.data;
        if (response?.data && typeof response.data === "object") return [response.data];
        return [];
      },
      providesTags: ["Documents"],
    }),

    updateAboutUs: builder.mutation<AboutUs, { content: string }>({
      query: (data) => ({
        url: "v1/dashboard/about-us/",
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: any): AboutUs => {
        return response?.data ?? response;
      },
      invalidatesTags: ["Documents"],
    }),

    getPrivacyPolicy: builder.query<PrivacyPolicy[], void>({
      query: () => "v1/dashboard/privacy-policy/",
      transformResponse: (response: any): PrivacyPolicy[] => {
        if (Array.isArray(response)) return response;
        if (Array.isArray(response?.data)) return response.data;
        if (response?.data && typeof response.data === "object") return [response.data];
        return [];
      },
      providesTags: ["Documents"],
    }),

    updatePrivacyPolicy: builder.mutation<PrivacyPolicy, { content: string }>({
      query: (data) => ({
        url: "v1/dashboard/privacy-policy/",
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: any): PrivacyPolicy => {
        return response?.data ?? response;
      },
      invalidatesTags: ["Documents"],
    }),

    getTermsConditions: builder.query<TermsCondition[], void>({
      query: () => "v1/dashboard/terms-conditions/",
      transformResponse: (response: any): TermsCondition[] => {
        if (Array.isArray(response)) return response;
        if (Array.isArray(response?.data)) return response.data;
        if (response?.data && typeof response.data === "object") return [response.data];
        return [];
      },
      providesTags: ["Documents"],
    }),

    updateTermsConditions: builder.mutation<TermsCondition, { content: string }>({
      query: (data) => ({
        url: "v1/dashboard/terms-conditions/",
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: any): TermsCondition => {
        return response?.data ?? response;
      },
      invalidatesTags: ["Documents"],
    }),

    // ─── Listings ──────────────────────────────────────────────────────────────
    getListings: builder.query<ListingItem[], void>({
      query: () => "v1/listing/",
      providesTags: ["Listings"],
    }),

    getListingDetail: builder.query<ListingItem, number>({
      query: (id) => `v1/listing/${id}/`,
      providesTags: (_result, _err, id) => [{ type: "Listings", id }],
    }),

    // ─── Payment & Wallet ──────────────────────────────────────────────────────
    generatePaymentLink: builder.mutation<Payment, number>({
      query: (bookingId) => ({
        url: `v1/payment/generate-link/${bookingId}/`,
        method: "POST",
      }),
    }),

    getWallet: builder.query<LandlordWallet, void>({
      query: () => "v1/payment/wallet/",
    }),

    getWithdrawRequests: builder.query<PaginatedResponse<WithdrawRequest>, { page?: number }>({
      query: ({ page } = {}) => ({
        url: "v1/payment/withdraw/",
        params: { page },
      }),
    }),

    createWithdrawRequest: builder.mutation<WithdrawRequest, WithdrawRequestRequest>({
      query: (data) => ({
        url: "v1/payment/withdraw/",
        method: "POST",
        body: data,
      }),
    }),

    adminWithdrawAction: builder.mutation<
      unknown,
      { id: number; data: WithdrawAdminActionRequest }
    >({
      query: ({ id, data }) => ({
        url: `v1/payment/withdraw/${id}/action/`,
        method: "PATCH",
        body: data,
      }),
    }),
  }),
});

export const {
  // Overview
  useGetAdminOverviewQuery,
  useGetDashboardOverviewQuery,
  // Notifications
  useGetAdminNotificationsQuery,
  useDeleteAdminNotificationMutation,
  useClearAllAdminNotificationsMutation,
  useGetNotificationsQuery,
  useDeleteNotificationMutation,
  useClearAllNotificationsMutation,
  // Users
  useGetAdminUsersQuery,
  useGetAdminUserDetailQuery,
  useToggleUserStatusMutation,
  useGetDashboardUsersQuery,
  useGetDashboardUserDetailQuery,
  useDeleteUserMutation,
  useUserActionMutation,
  // Bookings
  useGetBookingsQuery,
  useGetBookingDetailQuery,
  // FAQ
  useGetFAQsQuery,
  useCreateFAQMutation,
  useUpdateFAQMutation,
  useDeleteFAQMutation,
  // Support
  useGetSupportTicketsQuery,
  useUpdateTicketStatusMutation,
  // Documents
  useGetDocumentQuery,
  useUpsertDocumentMutation,
  useUpdateDocumentMutation,
  useGetAboutUsQuery,
  useUpdateAboutUsMutation,
  useGetPrivacyPolicyQuery,
  useUpdatePrivacyPolicyMutation,
  useGetTermsConditionsQuery,
  useUpdateTermsConditionsMutation,
  // Listings
  useGetListingsQuery,
  useGetListingDetailQuery,
  // Payment
  useGeneratePaymentLinkMutation,
  useGetWalletQuery,
  useGetWithdrawRequestsQuery,
  useCreateWithdrawRequestMutation,
  useAdminWithdrawActionMutation,
} = dashboardApi;

