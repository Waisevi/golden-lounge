import React from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service | GD Lounge & Bar Miami",
    description: "Read our Terms of Service to understand the rules, guidelines, and legal agreements for using the GD Lounge & Bar website and services.",
};

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-background">
            <Header />

            <div className="pt-32 pb-24 lg:pt-40 lg:pb-32">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-16">
                        <span className="text-sm font-semibold text-primary uppercase tracking-[0.2em] mb-4 block">
                            Legal
                        </span>
                        <h1 className="text-5xl sm:text-6xl font-bold text-foreground font-serif tracking-tight mb-8">
                            Terms of Service
                        </h1>
                        <p className="text-muted-foreground italic">Last Updated: January 26, 2026</p>
                    </div>

                    <div className="space-y-12 text-muted-foreground leading-relaxed
            [&>section>h2]:text-2xl [&>section>h2]:font-serif [&>section>h2]:text-foreground [&>section>h2]:font-bold [&>section>h2]:mb-4
            [&>section>p]:mb-4 [&>section>ul]:list-disc [&>section>ul]:pl-6 [&>section>ul]:space-y-2">

                        <section>
                            <h2>1. Agreement to Terms</h2>
                            <p>By accessing or using the GD Lounge & Bar website, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.</p>
                        </section>

                        <section>
                            <h2>2. Use License</h2>
                            <p>Permission is granted to temporarily download one copy of the materials (information or software) on GD Lounge & Bar's website for personal, non-commercial transitory viewing only.</p>
                            <p>This is the grant of a license, not a transfer of title, and under this license you may not:</p>
                            <ul>
                                <li>Modify or copy the materials;</li>
                                <li>Use the materials for any commercial purpose, or for any public display;</li>
                                <li>Attempt to decompile or reverse engineer any software contained on the website;</li>
                                <li>Remove any copyright or other proprietary notations from the materials;</li>
                                <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
                            </ul>
                        </section>

                        <section>
                            <h2>3. Reservations and Bookings</h2>
                            <p>Reservations made through our website are subject to availability and confirmation. GD Lounge & Bar reserves the right to cancel or modify reservations at its discretion.</p>
                            <ul>
                                <li>VIP table bookings may require a minimum spend or deposit.</li>
                                <li>Dress code policies must be adhered to for entry.</li>
                                <li>Valid government-issued ID is required for entry and alcohol consumption (21+).</li>
                            </ul>
                        </section>

                        <section>
                            <h2>4. Disclaimer</h2>
                            <p>The materials on GD Lounge & Bar's website are provided on an 'as is' basis. GD Lounge & Bar makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
                        </section>

                        <section>
                            <h2>5. Limitations</h2>
                            <p>In no event shall GD Lounge & Bar or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on GD Lounge & Bar's website.</p>
                        </section>

                        <section>
                            <h2>6. Governing Law</h2>
                            <p>These terms and conditions are governed by and construed in accordance with the laws of the State of Florida and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.</p>
                        </section>

                        <section>
                            <h2>SMS Terms</h2>
                            <p>GD Lounge may offer optional SMS communications to users who explicitly opt in via consent checkboxes on our website forms.</p>
                            <p>SMS messages may include ticket confirmations, event reminders, reservation updates, private event coordination, and promotional announcements (marketing messages are sent only if separately opted in).</p>
                            <p>Message frequency may vary. Message & data rates may apply. You may opt out at any time by replying STOP or request help by replying HELP.</p>
                            <p>SMS participation is optional and not required to submit a form.</p>
                        </section>

                        <section>
                            <h2>8. Changes to Terms</h2>
                            <p>GD Lounge & Bar reserves the right to revise these Terms of Service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these Terms of Service.</p>
                        </section>

                        <section>
                            <h2>8. Contact Information</h2>
                            <p>If you have any questions about these Terms, please contact us at reservations@gdmiami.com.</p>
                        </section>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
