// ─── Common ──────────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface SuccessResponse {
  success: boolean;
  message: string;
}

// ─── Admin Overview ───────────────────────────────────────────────────────────

export interface AdminOverview {
  overview: string;
  growth: string;
  roles: string;
  latest_bookings: string;
  new_users: string;
}

// ─── Users ────────────────────────────────────────────────────────────────────

export type UserRole = "renter" | "landlord";
export type UserStatus = "active" | "all" | "suspend";

export interface DashboardUserList {
  id: string;
  profile_picture: string | null;
  full_name: string | null;
  email: string;
  role: UserRole;
  created_at: string;
  is_active: boolean;
}

export interface AdminUserList {
  id: string;
  name: string;
  profile_pic: string | null;
  email: string;
  role: UserRole;
  joining_date: string;
  status: string;
}

export interface AdminUserDetail {
  id: string;
  name: string;
  profile_pic: string | null;
  personal_email: string;
  role: UserRole;
  joining_date: string;
  total_bookings: string;
  total_amount: string;
  platform_fee: string;
  total_listing: string;
  recent_bookings: string;
}

export interface UserActionRequest {
  action: "suspend" | "unsuspend";
}

export interface UserActionResponse {
  success: boolean;
  message: string;
}

export interface GetUsersParams {
  search?: string;
  status?: UserStatus;
}

export interface GetAdminUsersParams {
  page?: number;
  page_size?: number;
}

// ─── Booking ──────────────────────────────────────────────────────────────────

export type BookingStatus =
  | "pending"
  | "paid_pending_approval"
  | "confirmed"
  | "cancelled"
  | "completed";

export interface BookingUser {
  id: string;
  full_name: string | null;
  email: string;
  role: UserRole;
  profile_picture: string | null;
  airline: string | null;
  city: string | null;
  profession: string | null;
  is_verified: boolean;
}

export interface Booking {
  id: number;
  listing: number;
  renter: BookingUser;
  landlord: BookingUser;
  check_in_date: string;
  check_out_date: string;
  total_days: number | null;
  sub_total: string | null;
  platform_fee: string | null;
  total_amount: string | null;
  status: BookingStatus;
  created_at: string;
  updated_at: string;
  created_time_ago: string;
}

export interface BookingRequest {
  listing: number;
  check_in_date: string;
  check_out_date: string;
}

// ─── Notifications ────────────────────────────────────────────────────────────

export interface Notification {
  id: number;
  title: string;
  message: string;
  data: unknown | null;
  created_at: string;
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  user_type: UserRole;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FAQRequest {
  question: string;
  answer: string;
  user_type: UserRole;
  order?: number;
  is_active?: boolean;
}

// ─── Support Tickets ──────────────────────────────────────────────────────────

export type SupportTicketStatus = "pending" | "processing" | "resolved";

export interface SupportTicket {
  id: number;
  issue: string;
  attachment: string | null;
  status: SupportTicketStatus;
  created_at: string;
}

export interface UpdateTicketStatusRequest {
  status: SupportTicketStatus;
}

// ─── Policy / Documents ───────────────────────────────────────────────────────

export type DocumentSlug = "about-us" | "privacy-policy" | "terms-conditions";

export interface AppDocument {
  slug: DocumentSlug;
  title: string;
  content: string;
  updated_at: string;
}

export interface AppDocumentRequest {
  title: string;
  content: string;
}

export interface AboutUs {
  content: string;
  updated_at: string;
}

export interface PrivacyPolicy {
  content: string;
  updated_at: string;
}

export interface TermsCondition {
  content: string;
  updated_at: string;
}

// ─── Listing ──────────────────────────────────────────────────────────────────

export type ListingType = "short_term" | "long_term";
export type PriceType = "per_night";
export type AvailabilityStatus = "available" | "booked" | "blocked";

export interface LandlordInfo {
  name: string;
  image: string | null;
  service_time: string;
  is_verified: boolean;
}

export interface ListingImage {
  id: number;
  image: string | null;
}

export interface ListingAvailabilitySlot {
  id: number;
  listing: number;
  start_date: string;
  end_date: string;
  status: AvailabilityStatus;
  custom_price: string | null;
}

export interface ReviewerInfo {
  id: string;
  name: string;
  image: string | null;
}

export interface ListingReview {
  id: number;
  reviewer: ReviewerInfo;
  point: number;
  comment: string;
  created_at: string;
}

export interface ListingItem {
  id: number;
  owner: LandlordInfo;
  title: string;
  listing_type?: ListingType;
  address?: string | null;
  city: string;
  state?: string | null;
  country?: string;
  latitude?: string | null;
  longitude?: string | null;
  nearest_airport_name: string;
  description?: string | null;
  bedroom?: number | null;
  bathroom?: number | null;
  min_guest?: number | null;
  max_guest?: number | null;
  amenities?: string[];
  price: string;
  price_type?: PriceType;
  currency?: string;
  house_rules?: string | null;
  images: ListingImage[];
  availability_slots: ListingAvailabilitySlot[];
  reviews: ListingReview[];
  average_rating: number;
  created_at: string;
  updated_at: string;
  is_active?: boolean;
}

// ─── Payment ──────────────────────────────────────────────────────────────────

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type WithdrawStatus = "pending" | "approved" | "rejected";

export interface Payment {
  id: number;
  booking: number;
  amount: string;
  currency: string;
  status: PaymentStatus;
  stripe_payment_link: string | null;
  created_at: string;
  updated_at: string;
}

export interface WalletTransaction {
  id?: number;
  amount?: string;
  type?: string;
  created_at?: string;
}

export interface RecentBooking {
  booking_id: number;
  renter_name: string;
  renter_profession: string;
  renter_image: string;
  starting_date: string;
  total_nights: number;
  total_payment: string;
  payment_status: string;
}

export interface LandlordWallet {
  id: number;
  balance?: string;
  currency?: string;
  total_earning: string;
  average_earning: number;
  occupancy: number;
  transactions: WalletTransaction[];
  recent_bookings: RecentBooking[];
  created_at: string;
  updated_at: string;
}

export interface WithdrawRequest {
  id: number;
  amount?: string;
  status?: WithdrawStatus;
  admin_note?: string | null;
  created_at?: string;
}

export interface WithdrawRequestRequest {
  amount: string;
}

export interface WithdrawAdminActionRequest {
  status?: WithdrawStatus;
  admin_note?: string | null;
}

