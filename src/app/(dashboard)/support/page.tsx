"use client";

import React from "react";
import SupportTicket from "@/components/support/SupportTicket";

const MOCK_TICKETS = [
  {
    id: 1,
    name: "Mr. John",
    email: "bulbulxyz@gmail.com",
    avatar: "https://i.pravatar.cc/150?u=john1",
    timestamp: "2024-03-09 - 10:30 AM",
    title: "The Title",
    description: "Dear users, the platform will undergo scheduled maintenance tonight from 2:00 AM to 3:00 AM. During this time, some features may be temporarily unavailable.",
    attachmentName: "xyz.pdf"
  },
  {
    id: 2,
    name: "Mr. John",
    email: "bulbulxyz@gmail.com",
    avatar: "https://i.pravatar.cc/150?u=john2",
    timestamp: "2024-03-09 - 10:30 AM",
    title: "The Title",
    description: "Dear users, the platform will undergo scheduled maintenance tonight from 2:00 AM to 3:00 AM. During this time, some features may be temporarily unavailable.",
    attachmentName: "xyz.pdf"
  },
  {
    id: 3,
    name: "Mr. John",
    email: "bulbulxyz@gmail.com",
    avatar: "https://i.pravatar.cc/150?u=john3",
    timestamp: "2024-03-09 - 10:30 AM",
    title: "The Title",
    description: "Dear users, the platform will undergo scheduled maintenance tonight from 2:00 AM to 3:00 AM. During this time, some features may be temporarily unavailable.",
    attachmentName: "xyz.pdf"
  },
  {
    id: 4,
    name: "Mr. John",
    email: "bulbulxyz@gmail.com",
    avatar: "https://i.pravatar.cc/150?u=john4",
    timestamp: "2024-03-09 - 10:30 AM",
    title: "The Title",
    description: "Dear users, the platform will undergo scheduled maintenance tonight from 2:00 AM to 3:00 AM. During this time, some features may be temporarily unavailable.",
    attachmentName: "xyz.pdf"
  },
  {
    id: 5,
    name: "Mr. John",
    email: "bulbulxyz@gmail.com",
    avatar: "https://i.pravatar.cc/150?u=john5",
    timestamp: "2024-03-09 - 10:30 AM",
    title: "The Title",
    description: "Dear users, the platform will undergo scheduled maintenance tonight from 2:00 AM to 3:00 AM. During this time, some features may be temporarily unavailable.",
    attachmentName: "xyz.pdf"
  },
  {
    id: 6,
    name: "Mr. John",
    email: "bulbulxyz@gmail.com",
    avatar: "https://i.pravatar.cc/150?u=john6",
    timestamp: "2024-03-09 - 10:30 AM",
    title: "The Title",
    description: "Dear users, the platform will undergo scheduled maintenance tonight from 2:00 AM to 3:00 AM. During this time, some features may be temporarily unavailable.",
    attachmentName: "xyz.pdf"
  },
  {
    id: 7,
    name: "Mr. John",
    email: "bulbulxyz@gmail.com",
    avatar: "https://i.pravatar.cc/150?u=john7",
    timestamp: "2024-03-09 - 10:30 AM",
    title: "The Title",
    description: "Dear users, the platform will undergo scheduled maintenance tonight from 2:00 AM to 3:00 AM. During this time, some features may be temporarily unavailable.",
    attachmentName: "xyz.pdf"
  },
  {
    id: 8,
    name: "Mr. John",
    email: "bulbulxyz@gmail.com",
    avatar: "https://i.pravatar.cc/150?u=john8",
    timestamp: "2024-03-09 - 10:30 AM",
    title: "The Title",
    description: "Dear users, the platform will undergo scheduled maintenance tonight from 2:00 AM to 3:00 AM. During this time, some features may be temporarily unavailable.",
    attachmentName: "xyz.pdf"
  },
];

export default function ContactSupportPage() {
  return (
    <div className="h-full animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
        {MOCK_TICKETS.map((ticket) => (
          <SupportTicket key={ticket.id} {...ticket} />
        ))}
      </div>
    </div>
  );
}
