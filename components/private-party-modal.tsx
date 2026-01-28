"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle, Check, Crown } from "lucide-react";
import Link from "next/link";

interface PrivatePartyModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export function PrivatePartyModal({ isOpen, onOpenChange }: PrivatePartyModalProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [date, setDate] = useState("");
    const [guests, setGuests] = useState("");
    const [message, setMessage] = useState("");
    const [honeypot, setHoneypot] = useState("");
    const [agreeNonMarketing, setAgreeNonMarketing] = useState(false);
    const [agreeMarketing, setAgreeMarketing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const formatPhoneNumber = (value: string): string => {
        const phoneNumber = value.replace(/\D/g, "");
        if (phoneNumber.length === 0) return "";
        if (phoneNumber.length < 4) return `(${phoneNumber}`;
        if (phoneNumber.length < 7) return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
        return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhone(formatPhoneNumber(e.target.value));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (honeypot) return;

        if (!agreeNonMarketing) {
            setError("Please consent to receive non-marketing text messages.");
            return;
        }

        setIsLoading(true);

        // Append Date and Guests to message
        const formattedMessage = `
Event Date: ${date}
Number of Guests: ${guests}

${message}
    `.trim();

        try {
            const res = await fetch("/api/lead", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    formType: "private_party",
                    name,
                    email,
                    phone: phone.replace(/\D/g, ""),
                    message: formattedMessage,
                    honeypot,
                }),
            });

            const data = await res.json();
            if (!res.ok || !data.success) throw new Error(data.error || "Submission failed");

            setIsSubmitted(true);
            setTimeout(() => {
                onOpenChange(false);
                // Reset form
                setIsSubmitted(false);
                setName("");
                setEmail("");
                setPhone("");
                setDate("");
                setGuests("");
                setMessage("");
            }, 2000);
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 border-0 bg-transparent">
                <DialogTitle className="sr-only">Book a Private Party</DialogTitle>
                <div className="bg-background border border-border/50 rounded-3xl p-6 lg:p-8 text-center">

                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Crown className="w-6 h-6 text-primary" />
                    </div>

                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3 font-serif">
                        Private Party
                    </h2>
                    <p className="text-base text-muted-foreground max-w-xl mx-auto mb-6">
                        Host your exclusive event at Golden Lounge. Tell us about your plans.
                    </p>

                    {!isSubmitted ? (
                        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
                            <input type="text" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} className="hidden" tabIndex={-1} autoComplete="off" />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2 text-left">
                                    <Label htmlFor="pp-name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Full Name <span className="text-primary">*</span></Label>
                                    <Input id="pp-name" required value={name} onChange={(e) => setName(e.target.value)} className="bg-card border-border/50" />
                                </div>
                                <div className="space-y-2 text-left">
                                    <Label htmlFor="pp-email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email <span className="text-primary">*</span></Label>
                                    <Input id="pp-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="bg-card border-border/50" />
                                </div>
                            </div>

                            <div className="space-y-2 text-left">
                                <Label htmlFor="pp-phone" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Phone <span className="text-primary">*</span></Label>
                                <Input id="pp-phone" type="tel" required value={phone} onChange={handlePhoneChange} maxLength={14} className="bg-card border-border/50" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2 text-left">
                                    <Label htmlFor="pp-date" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date <span className="text-primary">*</span></Label>
                                    <Input id="pp-date" type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="bg-card border-border/50 dark:[color-scheme:dark]" />
                                </div>
                                <div className="space-y-2 text-left">
                                    <Label htmlFor="pp-guests" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Guests <span className="text-primary">*</span></Label>
                                    <Input id="pp-guests" type="number" min="1" required value={guests} onChange={(e) => setGuests(e.target.value)} className="bg-card border-border/50" />
                                </div>
                            </div>

                            <div className="space-y-2 text-left">
                                <Label htmlFor="pp-message" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Message</Label>
                                <Textarea id="pp-message" value={message} onChange={(e) => setMessage(e.target.value)} className="min-h-[80px] bg-card border-border/50 resize-none" placeholder="Tell us more about your event..." />
                            </div>

                            {/* Consent Checkboxes */}
                            <div className="space-y-3 pt-1">
                                <div className="flex items-start gap-2.5 text-left">
                                    <Checkbox id="pp-agreeNonMarketing" checked={agreeNonMarketing} onCheckedChange={(c) => setAgreeNonMarketing(!!c)} className="mt-0.5 border-primary/40 data-[state=checked]:bg-primary" required />
                                    <label htmlFor="pp-agreeNonMarketing" className="text-xs text-muted-foreground cursor-pointer">
                                        I consent to receive non-marketing text messages from GD Lounge. Msg freq varies. Msg & data rates may apply.
                                    </label>
                                </div>
                                <div className="flex items-start gap-2.5 text-left">
                                    <Checkbox id="pp-agreeMarketing" checked={agreeMarketing} onCheckedChange={(c) => setAgreeMarketing(!!c)} className="mt-0.5 border-primary/40 data-[state=checked]:bg-primary" />
                                    <label htmlFor="pp-agreeMarketing" className="text-xs text-muted-foreground cursor-pointer">
                                        I consent to receive marketing text messages from GD Lounge. Msg freq varies. Msg & data rates may apply.
                                    </label>
                                </div>
                            </div>

                            {error && <div className="flex items-center gap-2 text-xs text-red-500 font-medium pt-1"><AlertTriangle className="w-3.5 h-3.5" />{error}</div>}

                            <Button type="submit" disabled={isLoading} className="w-full font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300">
                                {isLoading ? "Sending..." : "Request Booking"}
                            </Button>

                            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
                                <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                                <span className="text-muted-foreground/40">|</span>
                                <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
                            </div>

                        </form>
                    ) : (
                        <div className="max-w-md mx-auto py-10">
                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                                <Check className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold mb-2 font-serif">Request Sent!</h3>
                            <p className="text-sm text-muted-foreground">We'll be in touch shortly to confirm details.</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
