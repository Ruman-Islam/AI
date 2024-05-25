"use client";

import Sidebar from "./Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <section className="h-screen w-full bg-[#EEEEEE]">
      <div className="h-full w-full flex justify-between">
        <Sidebar />
        <div className="flex-1 m-3 border border-text__gray rounded-xl p-5">
          {children}
        </div>
      </div>
    </section>
  );
}
