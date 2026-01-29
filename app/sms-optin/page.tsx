import React from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { LeadForm } from "@/components/lead-form";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "SMS Opt-In | GD Lounge",
    description: "Opt-in to receive updates from GD Lounge.",
    robots: {
        index: true,
        follow: true,
    },
};

export default function SmsOptInPage() {
    return (
        <main className="min-h-screen bg-background">
            <Header />

            <div className="pt-32 pb-24 lg:pt-40 lg:pb-32">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl sm:text-5xl font-bold text-foreground font-serif tracking-tight mb-4">
                            SMS Opt-In
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Join our VIP list to receive exclusive updates.
                        </p>
                        <div className="mt-6 space-y-1">
                            <p className="font-bold text-foreground text-lg">GD Lounge</p>
                            <a
                                href="https://maps.app.goo.gl/odceBHiT9caqxArM7?g_st=ic"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-foreground hover:text-primary transition-colors block"
                            >
                                300 S Biscayne Blvd C-202B, Miami, FL
                            </a>
                            <p className="text-foreground">Phone: (305) 249-1222</p>
                        </div>
                    </div>

                    <div className="bg-card border border-border/50 rounded-3xl p-6 lg:p-8 shadow-sm">
                        <LeadForm
                            formType="vip"
                            title="Stay Connected"
                            description="Fill out the form below to subscribe to our updates."
                            buttonText="Subscribe"
                        />
                    </div>


                </div>
            </div>

            <Footer />
        </main>
    );
}
