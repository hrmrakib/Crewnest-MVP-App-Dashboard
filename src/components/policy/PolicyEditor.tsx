"use client";

import React, { useState } from "react";
import { Edit2, Check, RotateCcw, RotateCw, ZoomIn, Bold, Italic, Underline, Strikethrough, Droplet, Type, Link, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, AlignJustify, MoveHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PolicyEditor() {
  const [activeTab, setActiveTab] = useState("About CrewNest");
  const [roleTab, setRoleTab] = useState("For Renter");
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(`Kreo AI is a next-generation AI-powered creative platform that helps you generate stunning images and cinematic videos instantly from simple text prompts, photos, or reference images.

We are building a world where anyone—regardless of design or editing skills—can create professional-quality visual content in seconds. 
With powerful AI models and intelligent templates, Kreo AI empowers creators, marketers, influencers, and everyday users to bring imagination to life effortlessly.

What you can do with Kreo AI:
• Generate AI images from text or photos
• Create cinematic AI videos from prompts or images
• Use premium templates for fast creation
• Customize styles like anime, cinematic, realistic, fantasy, and more
• Share directly to social media platforms
• Save, edit, and regenerate your creations anytime

Our Mission
To make world-class AI creativity tools accessible, simple, and powerful for everyone.

Our Vision
To become the global hub for AI-generated visual storytelling.`);

  return (
    <div className="flex flex-col h-full">
      {/* Top Navigation */}
      <div className="flex items-center gap-6 border-b border-border mb-6 overflow-x-auto custom-scrollbar pb-1">
        {["About CrewNest", "Privacy Policy", "Terms& Policy"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "pb-3 text-lg font-semibold transition-colors relative whitespace-nowrap",
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

      {/* Main Content Area */}
      <div className="bg-[#EAEFF5] rounded-3xl p-6 md:p-8 flex-1 flex flex-col relative">
        
        {/* Role Toggle */}
        <div className="flex items-center gap-2 mb-6 bg-transparent">
          <button 
            onClick={() => setRoleTab("For Renter")}
            className={cn("px-5 py-2 rounded-full font-medium transition-colors text-sm", roleTab === "For Renter" ? "bg-[#112349] text-white" : "text-text-secondary hover:bg-white")}
          >
            For Renter
          </button>
          <button 
            onClick={() => setRoleTab("For Landlord")}
            className={cn("px-5 py-2 rounded-full font-medium transition-colors text-sm", roleTab === "For Landlord" ? "bg-[#112349] text-white" : "text-text-secondary hover:bg-white")}
          >
            For Landlord
          </button>
        </div>

        {/* Editor Card */}
        <div className="bg-white rounded-2xl shadow-sm flex-1 flex flex-col overflow-hidden border border-border">
          
          {/* Mock Toolbar (Only visible when editing) */}
          {isEditing && (
            <div className="bg-[#B8C5D3] p-3 flex items-center gap-4 border-b border-[#9CAEBF] overflow-x-auto custom-scrollbar rounded-t-2xl">
              <div className="flex items-center gap-1 border-r border-[#9CAEBF] pr-3 shrink-0 text-text-primary">
                <button className="p-1.5 hover:bg-white/50 rounded transition-colors"><RotateCcw className="w-4 h-4" /></button>
                <button className="p-1.5 hover:bg-white/50 rounded transition-colors"><RotateCw className="w-4 h-4" /></button>
                <span className="text-sm font-medium mx-1 flex items-center gap-1">100% <ZoomIn className="w-3 h-3"/></span>
              </div>
              
              <div className="flex items-center gap-2 border-r border-[#9CAEBF] pr-3 shrink-0">
                <button className="bg-[#414141] text-white text-xs px-3 py-1.5 rounded flex items-center gap-1 font-medium">Arial <span className="text-[10px]">▼</span></button>
                <button className="bg-[#414141] text-white text-xs px-3 py-1.5 rounded flex items-center gap-2 font-medium"><span>-</span> 00 <span>+</span></button>
              </div>

              <div className="flex items-center gap-1 border-r border-[#9CAEBF] pr-3 shrink-0 text-text-primary">
                <button className="p-1.5 hover:bg-white/50 rounded transition-colors font-serif font-bold"><Bold className="w-4 h-4" /></button>
                <button className="p-1.5 hover:bg-white/50 rounded transition-colors font-serif italic"><Italic className="w-4 h-4" /></button>
                <button className="p-1.5 hover:bg-white/50 rounded transition-colors"><Underline className="w-4 h-4" /></button>
                <button className="p-1.5 hover:bg-white/50 rounded transition-colors"><Strikethrough className="w-4 h-4" /></button>
                <button className="p-1.5 hover:bg-white/50 rounded transition-colors text-blue-600"><Droplet className="w-4 h-4 fill-blue-600" /></button>
                <button className="p-1.5 hover:bg-white/50 rounded transition-colors"><Type className="w-4 h-4" /></button>
              </div>

              <div className="flex items-center gap-1 border-r border-[#9CAEBF] pr-3 shrink-0 text-text-primary">
                <button className="p-1.5 hover:bg-white/50 rounded transition-colors"><Link className="w-4 h-4" /></button>
                <button className="p-1.5 hover:bg-white/50 rounded transition-colors"><List className="w-4 h-4" /></button>
                <button className="p-1.5 hover:bg-white/50 rounded transition-colors"><ListOrdered className="w-4 h-4" /></button>
              </div>

              <div className="flex items-center gap-1 shrink-0 text-text-primary">
                <button className="p-1.5 hover:bg-white/50 rounded transition-colors"><AlignLeft className="w-4 h-4" /></button>
                <button className="p-1.5 hover:bg-white/50 rounded transition-colors"><AlignCenter className="w-4 h-4" /></button>
                <button className="p-1.5 hover:bg-white/50 rounded transition-colors"><AlignRight className="w-4 h-4" /></button>
                <button className="p-1.5 hover:bg-white/50 rounded transition-colors"><AlignJustify className="w-4 h-4" /></button>
                <button className="p-1.5 hover:bg-white/50 rounded transition-colors"><MoveHorizontal className="w-4 h-4" /></button>
              </div>
            </div>
          )}

          {/* Text Area */}
          <div className="p-6 md:p-8 flex-1">
            {isEditing ? (
              <textarea 
                className="w-full h-full bg-transparent border-none outline-none resize-none text-text-primary text-base leading-relaxed"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            ) : (
              <div className="text-text-primary text-base leading-relaxed whitespace-pre-wrap font-medium">
                {content}
              </div>
            )}
          </div>

        </div>

        {/* Floating Action Button */}
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="absolute bottom-10 right-10 md:bottom-12 md:right-12 w-14 h-14 bg-[#112349] hover:bg-[#1a3060] rounded-full flex items-center justify-center text-white shadow-xl transition-all hover:scale-105 active:scale-95 z-10 animate-fade-in-scale"
        >
          {isEditing ? <Check className="w-6 h-6" /> : <Edit2 className="w-6 h-6" />}
        </button>

      </div>
    </div>
  );
}
