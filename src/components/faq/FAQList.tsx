"use client";

import React, { useState } from "react";
import { Plus, Edit2, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useGetFAQsQuery,
  useCreateFAQMutation,
  useUpdateFAQMutation,
  useDeleteFAQMutation,
} from "@/redux/services/dashboardApi";
import type { FAQ, FAQRequest } from "@/redux/types/api.types";

const BLANK_FAQ: FAQRequest = { question: "", answer: "", user_type: "renter" };

export default function FAQList() {
  const [activeTab, setActiveTab] = useState<"For Renter" | "For Landlord">("For Renter");
  const userType = activeTab === "For Renter" ? "renter" : "landlord";

  const { data: faqs, isLoading } = useGetFAQsQuery({ user_type: userType });
  const [createFAQ, { isLoading: isCreating }] = useCreateFAQMutation();
  const [updateFAQ, { isLoading: isUpdating }] = useUpdateFAQMutation();
  const [deleteFAQ, { isLoading: isDeleting }] = useDeleteFAQMutation();

  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [editForm, setEditForm] = useState<FAQRequest>(BLANK_FAQ);

  const startEdit = (faq: FAQ) => {
    setEditingId(faq.id);
    setEditForm({ question: faq.question, answer: faq.answer, user_type: faq.user_type, order: faq.order, is_active: faq.is_active });
  };

  const startNew = () => {
    setEditingId("new");
    setEditForm({ ...BLANK_FAQ, user_type: userType });
  };

  const cancelEdit = () => { setEditingId(null); setEditForm(BLANK_FAQ); };

  const handleSave = async () => {
    try {
      if (editingId === "new") {
        await createFAQ(editForm).unwrap();
      } else if (typeof editingId === "number") {
        await updateFAQ({ id: editingId, data: editForm }).unwrap();
      }
      cancelEdit();
    } catch (err) { console.error("Save failed", err); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;
    try { await deleteFAQ(id).unwrap(); } catch (err) { console.error("Delete failed", err); }
  };

  const FALLBACK_FAQS: FAQ[] = [
    {
      id: 1,
      question: "How does the rental booking process work?",
      answer: "Verified airline crew members can search properties, view flexible rates, and request a booking directly with landlords with scheduled check-in dates.",
      user_type: "renter",
      order: 1,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 2,
      question: "What happens if my airline flight schedule changes?",
      answer: "CrewNest provides flexible reschedule policies for verified aviation professionals with valid airline schedule notices.",
      user_type: "renter",
      order: 2,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 3,
      question: "How do landlords receive payments?",
      answer: "Payments are processed securely via our automated payment portal and deposited directly into the landlord's registered bank or wallet account.",
      user_type: "landlord",
      order: 1,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  const displayFAQs: FAQ[] = React.useMemo(() => {
    if (Array.isArray(faqs) && faqs.length > 0) return faqs;
    if (Array.isArray((faqs as any)?.results) && (faqs as any).results.length > 0) {
      return (faqs as any).results;
    }
    if (Array.isArray(faqs)) return [];
    return FALLBACK_FAQS.filter((f) => f.user_type === userType);
  }, [faqs, userType]);

  const isBusy = isCreating || isUpdating || isDeleting;

  return (
    <div className="flex flex-col h-full">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-border w-full sm:w-auto">
          {(["For Renter", "For Landlord"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); cancelEdit(); }}
              className={cn(
                "pb-3 text-lg font-semibold transition-colors relative",
                activeTab === tab ? "text-primary" : "text-text-secondary hover:text-text-primary"
              )}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"></div>
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
            {isLoading ? "Loading..." : `Total: ${displayFAQs.length} Questions`}
          </p>
          <button
            onClick={startNew}
            disabled={isBusy || editingId === "new"}
            className="flex items-center justify-center gap-2 bg-[#112349] hover:bg-[#1a3060] text-white px-5 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50"
          >
            <Plus className="w-5 h-5" />
            Add New FAQ Question
          </button>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-12 text-text-secondary">
            <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading FAQs...
          </div>
        )}

        {/* New FAQ Form */}
        {editingId === "new" && (
          <div className="bg-[#B8C5D3] rounded-2xl p-6 shadow-sm border border-[#9CAEBF] mb-4 animate-fade-in-scale origin-top">
            <div className="space-y-3 mb-6">
              <div className="flex gap-4">
                <span className="font-semibold text-text-primary mt-3">Q :</span>
                <input
                  type="text"
                  placeholder="Enter question..."
                  value={editForm.question}
                  onChange={(e) => setEditForm(f => ({ ...f, question: e.target.value }))}
                  className="flex-1 w-full p-3 rounded-xl bg-white border-none outline-none focus:ring-2 focus:ring-primary/20 text-text-primary font-medium"
                />
              </div>
              <div className="flex gap-4">
                <span className="font-semibold text-text-primary mt-3">A :</span>
                <textarea
                  placeholder="Enter answer..."
                  value={editForm.answer}
                  onChange={(e) => setEditForm(f => ({ ...f, answer: e.target.value }))}
                  rows={3}
                  className="flex-1 w-full p-3 rounded-xl bg-white border-none outline-none focus:ring-2 focus:ring-primary/20 text-text-secondary resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={cancelEdit} className="px-6 py-2 rounded-xl border border-text-secondary/20 text-text-primary hover:bg-white/50 transition-colors font-medium">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isBusy || !editForm.question.trim() || !editForm.answer.trim()}
                className="px-6 py-2 rounded-xl bg-[#112349] hover:bg-[#1a3060] text-white transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
              >
                {isCreating && <Loader2 className="w-4 h-4 animate-spin" />}
                Save FAQ
              </button>
            </div>
          </div>
        )}

        {/* FAQ List */}
        <div className="space-y-4">
          {displayFAQs.map((faq) => {
            const isEditing = editingId === faq.id;

            if (isEditing) {
              return (
                <div key={faq.id} className="bg-[#B8C5D3] rounded-2xl p-6 shadow-sm border border-[#9CAEBF] animate-fade-in-scale origin-top">
                  <div className="space-y-3 mb-6">
                    <div className="flex gap-4">
                      <span className="font-semibold text-text-primary mt-3">Q :</span>
                      <input
                        type="text"
                        value={editForm.question}
                        onChange={(e) => setEditForm(f => ({ ...f, question: e.target.value }))}
                        className="flex-1 w-full p-3 rounded-xl bg-white border-none outline-none focus:ring-2 focus:ring-primary/20 text-text-primary font-medium"
                      />
                    </div>
                    <div className="flex gap-4">
                      <span className="font-semibold text-text-primary mt-3">A :</span>
                      <textarea
                        value={editForm.answer}
                        onChange={(e) => setEditForm(f => ({ ...f, answer: e.target.value }))}
                        rows={2}
                        className="flex-1 w-full p-3 rounded-xl bg-white border-none outline-none focus:ring-2 focus:ring-primary/20 text-text-secondary resize-none"
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-4">
                    <span className="text-sm text-text-secondary/70">
                      Last Updated: {new Date(faq.updated_at).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}
                    </span>
                    <div className="flex gap-3 justify-end">
                      <button onClick={cancelEdit} className="px-6 py-2 rounded-xl border border-text-secondary/20 text-text-primary hover:bg-white/50 transition-colors font-medium">
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={isBusy}
                        className="px-6 py-2 rounded-xl bg-[#112349] hover:bg-[#1a3060] text-white transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
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
              <div key={faq.id} className="bg-white rounded-2xl p-6 shadow-sm group flex justify-between gap-4 transition-all hover:shadow-md border border-transparent">
                <div className="space-y-2 flex-1">
                  <p className="font-semibold text-text-primary">Q : {faq.question}</p>
                  <p className="text-text-secondary">A : {faq.answer}</p>
                </div>
                <div className="flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => startEdit(faq)}
                    className="p-1 text-text-secondary hover:text-primary transition-colors"
                    disabled={isBusy}
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(faq.id)}
                    className="p-1 text-text-secondary hover:text-red-500 transition-colors"
                    disabled={isBusy}
                  >
                    {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
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
