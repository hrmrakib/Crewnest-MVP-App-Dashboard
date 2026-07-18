"use client";

import React, { useState } from "react";
import { X, MapPin, Calendar, Edit2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any; // We'll pass the mock user here
}

export default function UserDetailsModal({
  isOpen,
  onClose,
  user,
}: UserDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<string>(user?.role === "Landlord" ? "Listings" : "Ongoing");

  if (!isOpen || !user) return null;

  const isLandlord = user.role === "Landlord";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-fade-in-scale">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 md:px-8 border-b border-border">
          <h2 className="text-xl font-bold text-text-primary">User Details</h2>
          <button 
            onClick={onClose}
            className="p-2 text-text-secondary hover:text-text-primary hover:bg-surface-hover rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden shrink-0">
                <img src={user.avatar || `https://i.pravatar.cc/150?u=${user.id}`} alt={user.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-text-primary">{user.name}</h3>
                <p className="text-primary font-medium text-sm">{user.role}</p>
                <div className="text-sm text-text-secondary mt-1 space-y-0.5">
                  <p>ID: {user.tag || "1245"}</p>
                  <p>Personal Email : {user.email || "dfdfjhdf@gmail.com"}</p>
                  <p>Work Email &nbsp;&nbsp;&nbsp;&nbsp;: dfdfjhdf@gmail.com</p>
                </div>
              </div>
            </div>
            <div className="text-sm text-text-secondary md:text-right">
              Member since Jan 2022 • Los Angeles, CA
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#EAEFF5] p-5 rounded-2xl">
              <p className="text-sm text-text-secondary font-medium mb-1">Total Bookings</p>
              <p className="text-2xl font-semibold text-text-primary">16</p>
            </div>
            <div className="bg-[#EAEFF5] p-5 rounded-2xl">
              <p className="text-sm text-text-secondary font-medium mb-1">Total Amount</p>
              <p className="text-2xl font-semibold text-text-primary">$564</p>
            </div>
            <div className="bg-[#EAEFF5] p-5 rounded-2xl">
              <p className="text-sm text-text-secondary font-medium mb-1">Platform Fee</p>
              <p className="text-2xl font-semibold text-text-primary">$150</p>
            </div>
            {isLandlord && (
              <div className="bg-[#EAEFF5] p-5 rounded-2xl">
                <p className="text-sm text-text-secondary font-medium mb-1">Total Listing</p>
                <p className="text-2xl font-semibold text-text-primary">20</p>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-6 mb-6">
            <h4 className="text-lg font-semibold text-text-secondary">Recent Bookings</h4>
            {isLandlord ? (
              <button 
                onClick={() => setActiveTab("Listings")}
                className={cn(
                  "text-lg font-semibold transition-colors",
                  activeTab === "Listings" ? "text-primary" : "text-text-secondary hover:text-text-primary"
                )}
              >
                Listings
              </button>
            ) : (
              <div className="flex items-center gap-4 text-sm font-medium">
                <button 
                  onClick={() => setActiveTab("Ongoing")}
                  className={cn("px-4 py-1.5 rounded-full transition-colors", activeTab === "Ongoing" ? "bg-primary text-white" : "text-text-secondary hover:bg-surface-hover")}
                >
                  Ongoing
                </button>
                <button 
                  onClick={() => setActiveTab("Upcoming")}
                  className={cn("px-4 py-1.5 rounded-full transition-colors", activeTab === "Upcoming" ? "bg-primary text-white" : "text-text-secondary hover:bg-surface-hover")}
                >
                  Upcoming
                </button>
                <button 
                  onClick={() => setActiveTab("Completed")}
                  className={cn("px-4 py-1.5 rounded-full transition-colors", activeTab === "Completed" ? "bg-primary text-white" : "text-text-secondary hover:bg-surface-hover")}
                >
                  Completed
                </button>
              </div>
            )}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Render 3 mock cards based on role */}
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm group">
                {/* Image Section */}
                <div className="relative h-48 bg-gray-200">
                  <img 
                    src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80" 
                    alt="Property" 
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Tag */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-text-primary shadow-sm">
                    {isLandlord ? "Long-term" : "Ongoing"}
                  </div>

                  {/* Hover Actions (Landlord only) */}
                  {isLandlord && (
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 bg-white/90 backdrop-blur-sm rounded-md text-text-secondary hover:text-primary transition-colors shadow-sm">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 bg-white/90 backdrop-blur-sm rounded-md text-text-secondary hover:text-red-500 transition-colors shadow-sm">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-semibold text-text-primary">The Aviator Suite</h5>
                    {isLandlord && <span className="text-accent-amber font-medium text-sm">★ 4.5 <span className="text-text-muted text-xs">(20)</span></span>}
                  </div>
                  
                  {isLandlord ? (
                    <div className="flex justify-between items-end mt-4">
                      <div className="text-xs text-text-secondary space-y-1">
                        <div className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Los Angeles</div>
                        <div className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> 7 Booking</div>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-primary">$99</span>
                        <span className="text-xs text-text-secondary">/per day</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-xs text-text-secondary mb-4">15-18 Oct • 3 Night's • 2 Guest</p>
                      <div className="flex justify-between items-end border-t border-border pt-4">
                        <div className="flex items-center gap-2">
                          <img src="https://i.pravatar.cc/150?u=host" className="w-8 h-8 rounded-full" alt="Host" />
                          <div className="text-xs">
                            <span className="text-text-muted">Hosted By</span>
                            <p className="font-medium text-text-primary">Capt. Marcus</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold text-primary">$999</span>
                          <span className="text-xs text-text-secondary">/mth</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
