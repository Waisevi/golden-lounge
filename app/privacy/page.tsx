import React from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy | GD Lounge & Bar Miami",
    description: "Our Privacy Policy outlines how we collect, use, and protect your information when you visit GD Lounge & Bar.",
};

export default function PrivacyPage() {
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
                            Privacy Policy
                        </h1>
                        <p className="text-muted-foreground italic">Last Updated: January 26, 2026</p>
                    </div>

                    <div className="space-y-12 text-muted-foreground leading-relaxed
            [&>section>h2]:text-2xl [&>section>h2]:font-serif [&>section>h2]:text-foreground [&>section>h2]:font-bold [&>section>h2]:mb-4
            [&>section>p]:mb-4 [&>section>ul]:list-disc [&>section>ul]:pl-6 [&>section>ul]:space-y-2">

                        <section>
                            <h2>1. Introduction</h2>
                            <p>Welcome to GD Lounge & Bar. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information, please contact us.</p>
                        </section>

                        <section>
                            <h2>2. Information We Collect</h2>
                            <p>We collect personal information that you voluntarily provide to us when you express an interest in obtaining information about us or our products and Services, when you participate in activities on the Website or otherwise when you contact us.</p>
                            <ul>
                                <li><strong>Personal Data:</strong> Name, email address, phone number, and reservation details.</li>
                                <li><strong>Log Data:</strong> IP address, browser type, and usage patterns.</li>
                            </ul>
                        </section>

                        <section>
                            <h2>3. How We Use Your Information</h2>
                            <p>We use personal information collected via our Website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.</p>
                            <ul>
                                <li>To facilitate reservation and booking processes.</li>
                                <li>To send administrative information to you.</li>
                                <li>To respond to user inquiries/offer support.</li>
                                <li>To send marketing and promotional communications.</li>
                            </ul>
                        </section>

                        <section>
                            <h2>4. Sharing Your Information</h2>
                            <p>We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.</p>
                        </section>

                        <section>
                            <h2>5. SMS Communications</h2>
                            <p>By providing your phone number and opting in via an unchecked consent checkbox, you agree to receive SMS messages from GD Lounge.</p>
                            <p>SMS messages may include event updates, ticket confirmations, reservation reminders, private event coordination, and promotional messages (only if you explicitly opt in to marketing messages).</p>
                            <p>Message frequency may vary. Message & data rates may apply. You may opt out at any time by replying STOP or get help by replying HELP.</p>
                            <p>We do not sell, rent, or share phone numbers with third parties, except for SMS service providers used to deliver messages.</p>

                            <div className="mt-4 pt-4 border-t border-border/30 text-sm">
                                <p className="font-bold text-foreground">GD Lounge</p>
                                <p>
                                    <a href="https://maps.app.goo.gl/odceBHiT9caqxArM7?g_st=ic" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                                        300 S Biscayne Blvd Suite C-202B, Miami, FL 33131
                                    </a>
                                </p>
                                <p>Phone: (305) 249-1222 | Email: reservations@gdmiami.com</p>
                            </div>
                        </section>

                        <section>
                            <h2>6. Security of Your Information</h2>
                            <p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.</p>
                        </section>

                        <section>
                            <h2>7. Your Privacy Rights</h2>
                            <p>In some regions (like the EEA and UK), you have certain rights under applicable data protection laws. These may include the right (i) to request access and obtain a copy of your personal information, (ii) to request rectification or erasure; (iii) to restrict the processing of your personal information; and (iv) if applicable, to data portability.</p>
                        </section>

                        <section>
                            <h2>8. Cookies and Tracking Technologies</h2>
                            <p>GD Lounge may use basic cookies or similar technologies to ensure website functionality and improve user experience.</p>
                            <p>We do not use cookies to collect sensitive personal data without consent.</p>
                        </section>

                        <section>
                            <h2>9. Contact Us</h2>
                            <p>If you have questions or comments about this notice, you may email us at reservations@gdmiami.com or by post to:</p>
                            <p className="text-foreground">
                                GD Lounge & Bar<br />
                                <a href="https://maps.app.goo.gl/odceBHiT9caqxArM7?g_st=ic" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                                    300 S Biscayne Blvd Suite C-202B<br />
                                    Miami, FL 33131
                                </a>
                            </p>
                        </section>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
