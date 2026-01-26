import React from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { LocationSection } from "@/components/location-section";
import { LeadForm } from "@/components/lead-form";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact Us | GD Lounge & Bar Miami",
    description: "Get in touch with GD Lounge & Bar. Find our location in Downtown Miami, check our hours, or send us a message for reservations and inquiries.",
};

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-background">
            <Header />

            <div className="pt-32 lg:pt-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
                    <div className="max-w-3xl">
                        <span className="text-sm font-semibold text-primary uppercase tracking-[0.2em] mb-4 block">
                            Get In Touch
                        </span>
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground font-serif tracking-tight mb-8">
                            Contact Us
                        </h1>
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            Have questions or want to host a private event? Our team is here to assist you with reservations and any special requests.
                        </p>
                    </div>
                </div>

                {/* Existing Location Section (reused) */}
                <LocationSection />

                {/* Dedicated Message Form */}
                <section className="py-12 pb-32 bg-background">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl sm:text-4xl font-bold text-foreground font-serif">Send us a Message</h2>
                            <p className="text-muted-foreground mt-4 leading-relaxed">
                                Fill out the form below and we'll get back to you as soon as possible.
                            </p>
                        </div>
                        <LeadForm
                            formType="consultation"
                            title="Message Our Concierge"
                            description="Tell us how we can help make your experience better."
                            buttonText="Send Message"
                            className="shadow-2xl border-primary/5"
                        />
                    </div>
                </section>
            </div>

            <Footer />
        </main>
    );
}
