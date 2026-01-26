"use client";

import React from "react";
import { LeadForm } from "@/components/lead-form";

export function VipSection() {
  return (
    <section id="vip" className="py-24 lg:py-32 bg-card relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <LeadForm
          formType="vip"
          title="Join the VIP List"
          description="Be the first to know about exclusive events, special offers, and priority reservations."
          buttonText="Join VIP List"
        />
      </div>
    </section>
  );
}
