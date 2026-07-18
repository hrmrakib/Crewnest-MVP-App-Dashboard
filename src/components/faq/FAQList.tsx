"use client";

import React, { useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const mockFaqs = [
  { id: 1, q: "How does AI image generation work?", a: "Our engine uses advanced AI models ot transform your next prompts into high friendly visual." },
  { id: 2, q: "How does AI image generation work?", a: "Our engine uses advanced AI models ot transform your next prompts into high friendly visual." },
  { id: 3, q: "How does AI image generation work?", a: "Our engine uses advanced AI models ot transform your next prompts into high friendly visual." },
  { id: 4, q: "How does AI image generation work?", a: "Our engine uses advanced AI models ot transform your next prompts into high friendly visual." },
  { id: 5, q: "How does AI image generation work?", a: "Our engine uses advanced AI models ot transform your next prompts into high friendly visual." },
];

export default function FAQList() {
  const [activeTab, setActiveTab] = useState("For Renter");
  const [editingId, setEditingId] = useState<number | null>(2); // Setting id 2 to editing by default for the mockup look
  const [editQ, setEditQ] = useState("How does AI image generation work?");
  const [editA, setEditA] = useState("Our engine uses advanced AI models ot transform your next prompts into high friendly visual.");

  const startEdit = (faq: any) => {
    setEditingId(faq.id);
    setEditQ(faq.q);
    setEditA(faq.a);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-border w-full sm:w-auto">
          {["For Renter", "For Landlord"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
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
          <p className="text-text-primary font-medium">Total : 5 Questions</p>
          <button className="flex items-center justify-center gap-2 bg-[#112349] hover:bg-[#1a3060] text-white px-5 py-2.5 rounded-xl font-medium transition-colors">
            <Plus className="w-5 h-5" />
            Add New FAQ Question
          </button>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {mockFaqs.map((faq) => {
            const isEditing = editingId === faq.id;

            if (isEditing) {
              return (
                <div key={faq.id} className="bg-[#B8C5D3] rounded-2xl p-6 shadow-sm border border-[#9CAEBF] animate-fade-in-scale origin-top">
                  <div className="space-y-3 mb-6">
                    <div className="flex gap-4">
                      <span className="font-semibold text-text-primary mt-3">Q :</span>
                      <input 
                        type="text" 
                        value={editQ}
                        onChange={(e) => setEditQ(e.target.value)}
                        className="flex-1 w-full p-3 rounded-xl bg-white border-none outline-none focus:ring-2 focus:ring-primary/20 text-text-primary font-medium"
                      />
                    </div>
                    <div className="flex gap-4">
                      <span className="font-semibold text-text-primary mt-3">A :</span>
                      <textarea 
                        value={editA}
                        onChange={(e) => setEditA(e.target.value)}
                        rows={2}
                        className="flex-1 w-full p-3 rounded-xl bg-white border-none outline-none focus:ring-2 focus:ring-primary/20 text-text-secondary resize-none"
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-4">
                    <span className="text-sm text-text-secondary/70">Last Updated : 12 March, 2025</span>
                    <div className="flex gap-3 justify-end">
                      <button 
                        onClick={cancelEdit}
                        className="px-6 py-2 rounded-xl border border-text-secondary/20 text-text-primary hover:bg-white/50 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={cancelEdit}
                        className="px-6 py-2 rounded-xl bg-[#112349] hover:bg-[#1a3060] text-white transition-colors font-medium"
                      >
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
                  <p className="font-semibold text-text-primary">Q : {faq.q}</p>
                  <p className="text-text-secondary">A : {faq.a}</p>
                </div>
                <div className="flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => startEdit(faq)}
                    className="p-1 text-text-secondary hover:text-primary transition-colors"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button className="p-1 text-text-secondary hover:text-red-500 transition-colors">
                    <Trash2 className="w-5 h-5" />
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
