"use client";

import React, { useState } from "react";
import { Plus, Edit2, Trash2, Loader2, CheckCircle2, XCircle, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useGetFAQsQuery,
  useCreateFAQMutation,
  useUpdateFAQMutation,
  useDeleteFAQMutation,
} from "@/redux/services/dashboardApi";
import type { FAQ, FAQRequest } from "@/redux/types/api.types";

const BLANK_FAQ: FAQRequest = {
  question: "",
  answer: "",
  user_type: "renter",
  order: 0,
  is_active: true,
};

export default function FAQList() {
  const [activeTab, setActiveTab] = useState<"For Renter" | "For Landlord">("For Renter");
  const userType = activeTab === "For Renter" ? "renter" : "landlord";

  const { data: faqs, isLoading, error } = useGetFAQsQuery({ user_type: userType });
  const [createFAQ, { isLoading: isCreating }] = useCreateFAQMutation();
  const [updateFAQ, { isLoading: isUpdating }] = useUpdateFAQMutation();
  const [deleteFAQ, { isLoading: isDeleting }] = useDeleteFAQMutation();

  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [editForm, setEditForm] = useState<FAQRequest>(BLANK_FAQ);
  const [formError, setFormError] = useState<string | null>(null);

  const displayFAQs: FAQ[] = React.useMemo(() => {
    if (Array.isArray(faqs)) return faqs;
    if (Array.isArray((faqs as any)?.data)) return (faqs as any).data;
    if (Array.isArray((faqs as any)?.results)) return (faqs as any).results;
    return [];
  }, [faqs]);

  const startEdit = (faq: FAQ) => {
    setFormError(null);
    setEditingId(faq.id);
    setEditForm({
      question: faq.question || "",
      answer: faq.answer || "",
      user_type: faq.user_type || userType,
      order: typeof faq.order === "number" ? faq.order : 0,
      is_active: typeof faq.is_active === "boolean" ? faq.is_active : true,
    });
  };

  const startNew = () => {
    setFormError(null);
    setEditingId("new");
    const nextOrder =
      displayFAQs.length > 0
        ? Math.max(...displayFAQs.map((f) => (typeof f.order === "number" ? f.order : 0))) + 1
        : 0;
    setEditForm({
      question: "",
      answer: "",
      user_type: userType,
      order: nextOrder,
      is_active: true,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(BLANK_FAQ);
    setFormError(null);
  };

  const handleSave = async () => {
    if (!editForm.question.trim()) {
      setFormError("Question is required.");
      return;
    }
    if (!editForm.answer.trim()) {
      setFormError("Answer is required.");
      return;
    }

    const payload: FAQRequest = {
      question: editForm.question.trim(),
      answer: editForm.answer.trim(),
      user_type: editForm.user_type || userType,
      order: Number.isFinite(Number(editForm.order)) ? Number(editForm.order) : 0,
      is_active: Boolean(editForm.is_active),
    };

    setFormError(null);
    try {
      if (editingId === "new") {
        await createFAQ(payload).unwrap();
      } else if (typeof editingId === "number") {
        await updateFAQ({ id: editingId, data: payload }).unwrap();
      }
      cancelEdit();
    } catch (err: any) {
      console.error("Save failed", err);
      const detail =
        err?.data?.message ||
        err?.data?.detail ||
        (typeof err?.data === "object" ? JSON.stringify(err.data) : null) ||
        err?.message ||
        "Failed to save FAQ. Please try again.";
      setFormError(detail);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;
    try {
      await deleteFAQ(id).unwrap();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const isBusy = isCreating || isUpdating || isDeleting;

  return (
    <div className="flex flex-col h-full">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-border w-full sm:w-auto">
          {(["For Renter", "For Landlord"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                cancelEdit();
              }}
              className={cn(
                "pb-3 text-lg font-semibold transition-colors relative",
                activeTab === tab
                  ? "text-primary"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-[#EAEFF5] rounded-3xl p-6 md:p-8 flex-1">
        {/* Sub Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <p className="text-text-primary font-medium">
            {isLoading
              ? "Loading..."
              : `Total: ${displayFAQs.length} Question${
                  displayFAQs.length === 1 ? "" : "s"
                }`}
          </p>
          <button
            onClick={startNew}
            disabled={isBusy || editingId === "new"}
            className="flex items-center justify-center gap-2 bg-[#112349] hover:bg-[#1a3060] text-white px-5 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50 shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Add New FAQ Question
          </button>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm flex items-center justify-between">
            <span>
              {(error as any)?.data?.message ??
                (error as any)?.message ??
                "Unable to load FAQs. Please make sure you are logged in."}
            </span>
            <a
              href="/login"
              className="font-medium underline ml-3 hover:text-amber-900 shrink-0"
            >
              Sign In
            </a>
          </div>
        )}

        {/* Skeleton Loading */}
        {isLoading && (
          <div className="space-y-4 mb-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-sm animate-pulse space-y-3"
              >
                <div className="h-5 w-2/3 bg-slate-200 rounded-md" />
                <div className="h-4 w-full bg-slate-100 rounded-md" />
                <div className="h-4 w-4/5 bg-slate-100 rounded-md" />
              </div>
            ))}
          </div>
        )}

        {/* New FAQ Form */}
        {editingId === "new" && (
          <div className="bg-[#B8C5D3] rounded-2xl p-6 shadow-sm border border-[#9CAEBF] mb-4 animate-fade-in-scale origin-top">
            <h3 className="text-base font-semibold text-[#112349] mb-4">
              Create New FAQ ({editForm.user_type === "renter" ? "Renter" : "Landlord"})
            </h3>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                {formError}
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 sm:items-center">
                <span className="font-semibold text-text-primary w-8">Q :</span>
                <input
                  type="text"
                  placeholder="Enter question..."
                  value={editForm.question}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, question: e.target.value }))
                  }
                  className="flex-1 w-full p-3 rounded-xl bg-white border border-transparent outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/20 text-text-primary font-medium"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <span className="font-semibold text-text-primary w-8 pt-2">A :</span>
                <textarea
                  placeholder="Enter answer..."
                  value={editForm.answer}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, answer: e.target.value }))
                  }
                  rows={3}
                  className="flex-1 w-full p-3 rounded-xl bg-white border border-transparent outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/20 text-text-secondary resize-none"
                />
              </div>

              {/* Order & Status & Role Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 bg-white/40 p-4 rounded-xl border border-white/60">
                {/* User Type */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#112349] uppercase tracking-wider">
                    Target Audience
                  </label>
                  <select
                    value={editForm.user_type}
                    onChange={(e) =>
                      setEditForm((f) => ({
                        ...f,
                        user_type: e.target.value as "renter" | "landlord",
                      }))
                    }
                    className="p-2.5 rounded-lg bg-white border border-gray-300 text-sm font-medium text-text-primary outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="renter">Renter</option>
                    <option value="landlord">Landlord</option>
                  </select>
                </div>

                {/* Order */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#112349] uppercase tracking-wider">
                    Order Index
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={editForm.order}
                    onChange={(e) =>
                      setEditForm((f) => ({
                        ...f,
                        order: parseInt(e.target.value, 10) || 0,
                      }))
                    }
                    className="p-2.5 rounded-lg bg-white border border-gray-300 text-sm font-medium text-text-primary outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Active Toggle */}
                <div className="flex flex-col gap-1.5 justify-center">
                  <label className="text-xs font-semibold text-[#112349] uppercase tracking-wider">
                    Visibility Status
                  </label>
                  <label className="inline-flex items-center gap-2.5 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={editForm.is_active}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, is_active: e.target.checked }))
                      }
                      className="w-5 h-5 rounded text-[#112349] focus:ring-primary cursor-pointer accent-[#112349]"
                    />
                    <span className="text-sm font-medium text-text-primary">
                      {editForm.is_active ? "Active (Visible)" : "Inactive (Hidden)"}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelEdit}
                className="px-6 py-2 rounded-xl border border-text-secondary/20 text-text-primary hover:bg-white/50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isBusy || !editForm.question.trim() || !editForm.answer.trim()}
                className="px-6 py-2 rounded-xl bg-[#112349] hover:bg-[#1a3060] text-white transition-colors font-medium disabled:opacity-50 flex items-center gap-2 shadow-sm"
              >
                {isCreating && <Loader2 className="w-4 h-4 animate-spin" />}
                Save FAQ
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && displayFAQs.length === 0 && editingId !== "new" && (
          <div className="bg-white/70 rounded-2xl p-12 text-center border border-dashed border-border/80 flex flex-col items-center justify-center my-4">
            <p className="text-base font-semibold text-text-primary mb-1">
              No FAQs found
            </p>
            <p className="text-sm text-text-secondary mb-4">
              There are currently no FAQs for {activeTab.toLowerCase()}.
            </p>
            <button
              onClick={startNew}
              className="flex items-center gap-2 bg-[#112349] hover:bg-[#1a3060] text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add FAQ
            </button>
          </div>
        )}

        {/* FAQ List */}
        <div className="space-y-4">
          {displayFAQs.map((faq) => {
            const isEditing = editingId === faq.id;

            if (isEditing) {
              return (
                <div
                  key={faq.id}
                  className="bg-[#B8C5D3] rounded-2xl p-6 shadow-sm border border-[#9CAEBF] animate-fade-in-scale origin-top"
                >
                  <h3 className="text-base font-semibold text-[#112349] mb-4">
                    Edit FAQ #{faq.id}
                  </h3>

                  {formError && (
                    <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                      {formError}
                    </div>
                  )}

                  <div className="space-y-4 mb-6">
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 sm:items-center">
                      <span className="font-semibold text-text-primary w-8">Q :</span>
                      <input
                        type="text"
                        value={editForm.question}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, question: e.target.value }))
                        }
                        className="flex-1 w-full p-3 rounded-xl bg-white border border-transparent outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/20 text-text-primary font-medium"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                      <span className="font-semibold text-text-primary w-8 pt-2">A :</span>
                      <textarea
                        value={editForm.answer}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, answer: e.target.value }))
                        }
                        rows={3}
                        className="flex-1 w-full p-3 rounded-xl bg-white border border-transparent outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/20 text-text-secondary resize-none"
                      />
                    </div>

                    {/* Order & Status & Role Settings */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 bg-white/40 p-4 rounded-xl border border-white/60">
                      {/* User Type */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-[#112349] uppercase tracking-wider">
                          Target Audience
                        </label>
                        <select
                          value={editForm.user_type}
                          onChange={(e) =>
                            setEditForm((f) => ({
                              ...f,
                              user_type: e.target.value as "renter" | "landlord",
                            }))
                          }
                          className="p-2.5 rounded-lg bg-white border border-gray-300 text-sm font-medium text-text-primary outline-none focus:ring-2 focus:ring-primary/20"
                        >
                          <option value="renter">Renter</option>
                          <option value="landlord">Landlord</option>
                        </select>
                      </div>

                      {/* Order */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-[#112349] uppercase tracking-wider">
                          Order Index
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={editForm.order}
                          onChange={(e) =>
                            setEditForm((f) => ({
                              ...f,
                              order: parseInt(e.target.value, 10) || 0,
                            }))
                          }
                          className="p-2.5 rounded-lg bg-white border border-gray-300 text-sm font-medium text-text-primary outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>

                      {/* Active Toggle */}
                      <div className="flex flex-col gap-1.5 justify-center">
                        <label className="text-xs font-semibold text-[#112349] uppercase tracking-wider">
                          Visibility Status
                        </label>
                        <label className="inline-flex items-center gap-2.5 cursor-pointer pt-1">
                          <input
                            type="checkbox"
                            checked={editForm.is_active}
                            onChange={(e) =>
                              setEditForm((f) => ({ ...f, is_active: e.target.checked }))
                            }
                            className="w-5 h-5 rounded text-[#112349] focus:ring-primary cursor-pointer accent-[#112349]"
                          />
                          <span className="text-sm font-medium text-text-primary">
                            {editForm.is_active ? "Active (Visible)" : "Inactive (Hidden)"}
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-4">
                    <span className="text-sm text-text-secondary/70">
                      Last Updated:{" "}
                      {faq.updated_at
                        ? new Date(faq.updated_at).toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "N/A"}
                    </span>
                    <div className="flex gap-3 justify-end">
                      <button
                        onClick={cancelEdit}
                        className="px-6 py-2 rounded-xl border border-text-secondary/20 text-text-primary hover:bg-white/50 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={isBusy}
                        className="px-6 py-2 rounded-xl bg-[#112349] hover:bg-[#1a3060] text-white transition-colors font-medium disabled:opacity-50 flex items-center gap-2 shadow-sm"
                      >
                        {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl p-6 shadow-sm group flex justify-between gap-4 transition-all hover:shadow-md border border-transparent"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                      <ArrowUpDown className="w-3 h-3" />
                      Order: {faq.order ?? 0}
                    </span>
                    {faq.is_active ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 border border-gray-200">
                        <XCircle className="w-3 h-3" />
                        Inactive
                      </span>
                    )}
                    <span className="text-xs text-text-secondary font-medium capitalize">
                      • {faq.user_type}
                    </span>
                  </div>

                  <p className="font-semibold text-text-primary text-base">
                    Q : {faq.question}
                  </p>
                  <p className="text-text-secondary text-sm whitespace-pre-wrap leading-relaxed">
                    A : {faq.answer}
                  </p>
                </div>

                <div className="flex flex-col gap-2 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => startEdit(faq)}
                    className="p-2 rounded-lg text-text-secondary hover:text-primary hover:bg-[#EAEFF5] transition-colors"
                    title="Edit Question"
                    disabled={isBusy}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(faq.id)}
                    className="p-2 rounded-lg text-text-secondary hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="Delete Question"
                    disabled={isBusy}
                  >
                    {isDeleting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
