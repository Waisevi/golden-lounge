"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export function FaqSection() {
    const faqs = [
        {
            question: "Where is GD Lounge located?",
            answer: (
                <span>
                    We are located at{" "}
                    <a
                        href="https://share.google/P8IyjzbLyQo6ApO4s"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-primary"
                    >
                        300 S Biscayne Blvd Suite C-202B, Miami, FL 33131
                    </a>
                    . Access is available via the main building entrance.
                </span>
            ),
        },
        {
            question: "How can I make a reservation?",
            answer: "Reservations are highly recommended! You can book directly through our website, email us at reservations@gdmiami.com, or call/text us at +1 (305) 249-1222.",
        },
        {
            question: "Is there a dress code?",
            answer: "Yes, our dress code is upscale / smart casual. We strictly prohibit beachwear, flip flops, tank tops (for men), and athletic wear. We reserve the right to deny entry.",
        },
        {
            question: "Is there an age requirement?",
            answer: "Yes, GD Lounge is strictly 21+ after 9:00 PM. A valid government-issued ID is required for entry.",
        },
        {
            question: "Do you offer private events or VIP areas?",
            answer: "Absolutely. We offer exclusive VIP rooms and full-venue buyouts for private parties. You can book using the 'Become a VIP' or 'Private Party' buttons in our menu, or contact us directly.",
        },
        {
            question: "Is there parking available?",
            answer: "Valet parking is available at Novikov, located directly in front of the venue. There is also limited street parking nearby.",
        }
    ];

    return (
        <section id="faq" className="py-24 bg-background">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="text-sm font-semibold text-primary uppercase tracking-widest">
                        Need to Know
                    </span>
                    <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-foreground font-serif">
                        Frequently Asked Questions
                    </h2>
                </div>

                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`} className="border-border/40">
                            <AccordionTrigger className="text-left text-foreground hover:text-primary transition-colors text-lg">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
}
