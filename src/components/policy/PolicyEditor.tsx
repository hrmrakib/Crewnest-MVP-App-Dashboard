"use client";

import  { useState, useEffect, useMemo, useRef } from "react";
import {
  Edit2,
  Check,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Loader2,
  Save,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useGetAboutUsQuery,
  useUpdateAboutUsMutation,
  useGetPrivacyPolicyQuery,
  useUpdatePrivacyPolicyMutation,
  useGetTermsConditionsQuery,
  useUpdateTermsConditionsMutation,
} from "@/redux/services/dashboardApi";
import { useToast } from "@/components/toast";

type PolicyTab = "About CrewNest" | "Privacy Policy" | "Terms & Conditions";

interface PolicyDoc {
  content: string;
  updated_at?: string;
}

/**
 * Safely extract policy document whether response is:
 * - { success: true, data: [ { content, updated_at } ] }
 * - { success: true, data: { content, updated_at } }
 * - [ { content, updated_at } ]
 * - { content, updated_at }
 */
function parsePolicyData(data: any): PolicyDoc | null {
  if (!data) return null;

  // Wrapped in { success: true, data: [...] } or { data: {...} }
  if (data?.data !== undefined) {
    if (Array.isArray(data.data) && data.data.length > 0) {
      return data.data[0];
    }
    if (typeof data.data === "object" && data.data !== null && "content" in data.data) {
      return data.data;
    }
  }

  // Direct array [...]
  if (Array.isArray(data) && data.length > 0) {
    return data[0];
  }

  // Direct object { content: ... }
  if (typeof data === "object" && data !== null && "content" in data) {
    return data;
  }

  return null;
}

export default function PolicyEditor() {
  const [activeTab, setActiveTab] = useState<PolicyTab>("About CrewNest");
  // const [roleTab, setRoleTab] = useState<"For Renter" | "For Landlord">("For Renter");
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { addToast } = useToast();

  // RTK Query hooks
  const { data: aboutData, isLoading: loadingAbout } = useGetAboutUsQuery();
  const { data: privacyData, isLoading: loadingPrivacy } = useGetPrivacyPolicyQuery();
  const { data: termsData, isLoading: loadingTerms } = useGetTermsConditionsQuery();

  // Mutations
  const [updateAbout, { isLoading: savingAbout }] = useUpdateAboutUsMutation();
  const [updatePrivacy, { isLoading: savingPrivacy }] = useUpdatePrivacyPolicyMutation();
  const [updateTerms, { isLoading: savingTerms }] = useUpdateTermsConditionsMutation();

  const isSaving = savingAbout || savingPrivacy || savingTerms;
  const isLoading =
    (activeTab === "About CrewNest" && loadingAbout) ||
    (activeTab === "Privacy Policy" && loadingPrivacy) ||
    (activeTab === "Terms & Conditions" && loadingTerms);

  // Parse active document and fallback
  const currentDoc = useMemo(() => {
    switch (activeTab) {
      case "About CrewNest":
        return parsePolicyData(aboutData);
      case "Privacy Policy":
        return parsePolicyData(privacyData);
      case "Terms & Conditions":
        return parsePolicyData(termsData);
      default:
        return null;
    }
  }, [activeTab, aboutData, privacyData, termsData]);

  const serverContent = currentDoc?.content ?? "";
  const lastUpdatedAt = currentDoc?.updated_at;

  // Sync content state when server content changes or user cancels
  useEffect(() => {
    if (!isEditing) {
      setContent(serverContent);
    }
  }, [serverContent, isEditing]);

  const handleSave = async () => {
    if (!content.trim()) {
      addToast("Content cannot be empty", "error");
      return;
    }

    try {
      if (activeTab === "About CrewNest") {
        await updateAbout({ content: content.trim() }).unwrap();
      } else if (activeTab === "Privacy Policy") {
        await updatePrivacy({ content: content.trim() }).unwrap();
      } else if (activeTab === "Terms & Conditions") {
        await updateTerms({ content: content.trim() }).unwrap();
      }
      setIsEditing(false);
      addToast(`${activeTab} updated successfully`, "success");
    } catch (err: any) {
      console.error("Save policy error:", err);
      const msg =
        err?.data?.message ||
        err?.data?.detail ||
        err?.message ||
        `Failed to update ${activeTab}`;
      addToast(msg, "error");
    }
  };

  const handleFormat = (prefix: string, suffix: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end);
    const newContent =
      content.substring(0, start) + prefix + selected + suffix + content.substring(end);
    setContent(newContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Top Navigation Tabs */}
      <div className="flex items-center gap-6 border-b border-border mb-6 overflow-x-auto custom-scrollbar pb-1">
        {(["About CrewNest", "Privacy Policy", "Terms & Conditions"] as PolicyTab[]).map(
          (tab) => (
            <button
              key={tab}
              onClick={() => {
                if (isEditing) {
                  if (!confirm("You have unsaved changes. Discard them?")) return;
                  setIsEditing(false);
                }
                setActiveTab(tab);
              }}
              className={cn(
                "pb-3 text-lg font-semibold transition-colors relative whitespace-nowrap",
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
          )
        )}
      </div>

      {/* Main Content Area */}
      <div className="bg-[#EAEFF5] rounded-3xl p-6 md:p-8 flex-1 flex flex-col relative min-h-[520px]">
        {/* Controls Row: Role Toggles & Last Updated / Actions */}
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          {/* <div className="flex items-center gap-2 bg-transparent">
            <button
              onClick={() => setRoleTab("For Renter")}
              className={cn(
                "px-5 py-2 rounded-full font-medium transition-colors text-sm",
                roleTab === "For Renter"
                  ? "bg-[#112349] text-white shadow-sm"
                  : "text-text-secondary hover:bg-white"
              )}
            >
              For Renter
            </button>
            <button
              onClick={() => setRoleTab("For Landlord")}
              className={cn(
                "px-5 py-2 rounded-full font-medium transition-colors text-sm",
                roleTab === "For Landlord"
                  ? "bg-[#112349] text-white shadow-sm"
                  : "text-text-secondary hover:bg-white"
              )}
            >
              For Landlord
            </button>
          </div> */}

          <div className="flex items-center gap-3">
            {lastUpdatedAt && (
              <span className="inline-flex items-center gap-1.5 text-xs text-text-secondary bg-white px-3.5 py-1.5 rounded-full border border-border shadow-xs">
                <Clock className="w-3.5 h-3.5 text-text-secondary" />
                Last Updated:{" "}
                {new Date(lastUpdatedAt).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            )}

            {/* Quick action buttons while editing */}
            {isEditing && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setContent(serverContent);
                    setIsEditing(false);
                  }}
                  className="px-4 py-1.5 text-sm font-medium text-text-secondary hover:text-text-primary bg-white rounded-xl border border-border shadow-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-5 py-1.5 text-sm font-medium text-white bg-primary hover:bg-[#1a3060] rounded-xl shadow-md transition-colors disabled:opacity-50"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Editor Card */}
        <div className="bg-white rounded-2xl shadow-sm flex-1 flex flex-col overflow-hidden border border-border">
          {/* Toolbar (Only visible when editing) */}
          {isEditing && (
            <div className="bg-[#B8C5D3] p-3 flex items-center gap-4 border-b border-[#9CAEBF] overflow-x-auto custom-scrollbar rounded-t-2xl">
              <div className="flex items-center gap-1 border-r border-[#9CAEBF] pr-3 shrink-0 text-text-primary">
                <button
                  type="button"
                  onClick={() => handleFormat("**", "**")}
                  className="p-1.5 hover:bg-white/50 rounded transition-colors font-bold"
                  title="Bold"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleFormat("*", "*")}
                  className="p-1.5 hover:bg-white/50 rounded transition-colors italic"
                  title="Italic"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleFormat("__", "__")}
                  className="p-1.5 hover:bg-white/50 rounded transition-colors"
                  title="Underline"
                >
                  <Underline className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-1 border-r border-[#9CAEBF] pr-3 shrink-0 text-text-primary">
                <button
                  type="button"
                  onClick={() => handleFormat("\n- ", "")}
                  className="p-1.5 hover:bg-white/50 rounded transition-colors"
                  title="Bullet list"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleFormat("\n1. ", "")}
                  className="p-1.5 hover:bg-white/50 rounded transition-colors"
                  title="Numbered list"
                >
                  <ListOrdered className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2 shrink-0 text-xs text-text-secondary font-medium">
                <span>Markdown editing supported</span>
              </div>
            </div>
          )}

          {/* Text Area & Content Display */}
          <div className="p-6 md:p-8 flex-1 min-h-[320px] overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-full text-text-secondary py-16">
                <Loader2 className="w-6 h-6 animate-spin mr-3 text-primary" />
                <span>Loading {activeTab}...</span>
              </div>
            ) : isEditing ? (
              <textarea
                ref={textareaRef}
                className="w-full h-full min-h-[350px] bg-transparent border-none outline-none resize-none text-text-primary text-base leading-relaxed font-mono"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={`Enter ${activeTab.toLowerCase()} content...`}
              />
            ) : content ? (
              <div className="text-text-primary text-base leading-relaxed whitespace-pre-wrap font-normal">
                {content}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center text-text-secondary">
                <p className="text-base font-semibold text-text-primary mb-1">
                  No content available for {activeTab}
                </p>
                <p className="text-sm text-text-secondary mb-4">
                  Click the button below to add and publish content.
                </p>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-2 bg-[#112349] hover:bg-[#1a3060] text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm"
                >
                  <Edit2 className="w-4 h-4" /> Add Content
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Floating Action Button */}
        <button
          onClick={() => {
            if (isEditing) {
              handleSave();
            } else {
              setIsEditing(true);
            }
          }}
          disabled={isSaving}
          className="absolute bottom-10 right-10 md:bottom-12 md:right-12 w-14 h-14 bg-[#112349] hover:bg-[#1a3060] rounded-full flex items-center justify-center text-white shadow-xl transition-all hover:scale-105 active:scale-95 z-10 animate-fade-in-scale disabled:opacity-50"
          title={isEditing ? "Save changes" : "Edit content"}
        >
          {isSaving ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : isEditing ? (
            <Check className="w-6 h-6" />
          ) : (
            <Edit2 className="w-6 h-6" />
          )}
        </button>
      </div>
    </div>
  );
}
