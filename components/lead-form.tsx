"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Crown, Check, AlertTriangle } from "lucide-react";

interface LeadFormProps {
    formType: "vip" | "reserve" | "consultation";
    title?: string;
    description?: string;
    buttonText?: string;
    className?: string;
    onSuccess?: () => void;
}

export function LeadForm({
    formType,
    title = "Join the VIP List",
    description = "Be the first to know about exclusive events, special offers, and priority reservations.",
    buttonText = "Join VIP List",
    className = "",
    onSuccess,
}: LeadFormProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    const [honeypot, setHoneypot] = useState("");

    const [agreeNonMarketing, setAgreeNonMarketing] = useState(false);
    const [agreeMarketing, setAgreeMarketing] = useState(false);

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isEmailValid = (value: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    const formatPhoneNumber = (value: string): string => {
        // Удаляем все нецифровые символы
        const phoneNumber = value.replace(/\D/g, "");

        // Ограничиваем до 10 цифр
        const phoneNumberLength = phoneNumber.length;
        if (phoneNumberLength === 0) return "";

        if (phoneNumberLength < 4) {
            return `(${phoneNumber}`;
        } else if (phoneNumberLength < 7) {
            return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
        } else {
            return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
        }
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhoneNumber(e.target.value);
        setPhone(formatted);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (honeypot) return;

        if (!name || name.trim() === "") {
            setError("Please enter your full name.");
            return;
        }

        if (!email || !isEmailValid(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        // Проверяем, что номер содержит 10 цифр
        const phoneDigits = phone.replace(/\D/g, "");
        if (!phone || phoneDigits.length !== 10) {
            setError("Please enter a valid 10-digit phone number.");
            return;
        }



        // Removing the agreeNonMarketing validation block completely

        setIsLoading(true);

        try {
            const res = await fetch("/api/lead", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    formType,
                    name,
                    email,
                    phone: phone.replace(/\D/g, ""), // Отправляем только цифры
                    message,
                    honeypot,
                    agreeNonMarketing,
                    agreeMarketing,
                }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.error || "Submission failed");
            }

            setIsSubmitted(true);
            if (onSuccess) {
                setTimeout(() => {
                    onSuccess();
                }, 2000);
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`bg-background border border-border/50 rounded-3xl p-6 lg:p-8 text-center ${className}`}>
            {/* Icon */}
            {(description || title === "Join the VIP List") && (
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Crown className="w-6 h-6 text-primary" />
                </div>
            )}

            {/* Content */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3 text-balance font-serif">
                {title}
            </h2>
            {description && description.trim() && (
                <p className="text-base text-muted-foreground max-w-xl mx-auto mb-6">
                    {description}
                </p>
            )}

            {/* Form */}
            {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
                    <input
                        type="text"
                        name="company"
                        value={honeypot}
                        onChange={(e) => setHoneypot(e.target.value)}
                        className="hidden"
                        tabIndex={-1}
                        autoComplete="off"
                    />

                    {/* Full Name and Email in one row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 text-left">
                            <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Full Name <span className="text-primary">*</span>
                            </Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="h-10 rounded-lg bg-card border-border/50 focus:border-primary/50 transition-colors"
                                required
                            />
                        </div>

                        <div className="space-y-2 text-left">
                            <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Email <span className="text-primary">*</span>
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="john@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-10 rounded-lg bg-card border-border/50 focus:border-primary/50 transition-colors"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2 text-left">
                        <Label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Phone Number <span className="text-primary">*</span>
                        </Label>
                        <Input
                            id="phone"
                            type="tel"
                            placeholder="(555) 123-4567"
                            value={phone}
                            onChange={handlePhoneChange}
                            maxLength={14}
                            className="h-10 rounded-lg bg-card border-border/50 focus:border-primary/50 transition-colors"
                            required
                        />
                    </div>

                    <div className="space-y-2 text-left">
                        <Label htmlFor="message" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Message <span className="text-muted-foreground/60">(optional)</span>
                        </Label>
                        <Textarea
                            id="message"
                            placeholder="Briefly describe the service you need..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="min-h-[80px] rounded-lg bg-card border-border/50 focus:border-primary/50 transition-colors resize-none"
                        />
                    </div>

                    <div className="space-y-3 pt-1">
                        <div className="flex items-start gap-2.5 text-left">
                            <Checkbox
                                id="agreeNonMarketing"
                                checked={agreeNonMarketing}
                                onCheckedChange={(checked) => setAgreeNonMarketing(checked as boolean)}
                                className="mt-0.5 border-primary/40 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                            />
                            <label
                                htmlFor="agreeNonMarketing"
                                className="text-xs leading-relaxed text-muted-foreground cursor-pointer select-none"
                            >
                                I consent to receive non-marketing SMS messages from GD Lounge related to ticket purchases, event reminders, reservations, schedule updates, and important venue notifications. Message frequency may vary. Message & data rates may apply. Reply HELP for assistance. Reply STOP to opt out.
                            </label>
                        </div>

                        <div className="flex items-start gap-2.5 text-left">
                            <Checkbox
                                id="agreeMarketing"
                                checked={agreeMarketing}
                                onCheckedChange={(checked) => setAgreeMarketing(checked as boolean)}
                                className="mt-0.5 border-primary/40 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                            />
                            <label
                                htmlFor="agreeMarketing"
                                className="text-xs leading-relaxed text-muted-foreground cursor-pointer select-none"
                            >
                                I consent to receive marketing SMS messages from GD Lounge, including event announcements and special offers. Message frequency may vary. Message & data rates may apply. Reply HELP for assistance. Reply STOP to opt out.
                            </label>
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 text-xs text-red-500 font-medium pt-1">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            {error}
                        </div>
                    )}

                    <p className="text-[10px] text-muted-foreground leading-tight text-center pt-2">
                        By submitting this form, you agree to receive SMS messages only if you checked a consent box above. Message frequency may vary. Message & data rates may apply. Reply STOP to opt out or HELP for help.
                    </p>

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-10 text-base font-bold rounded-lg mt-1 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300"
                    >
                        {isLoading ? "Sending..." : buttonText}
                    </Button>

                    <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
                        <Link href="/privacy" className="hover:text-primary transition-colors">
                            Privacy Policy
                        </Link>
                        <span className="text-muted-foreground/40">|</span>
                        <Link href="/terms" className="hover:text-primary transition-colors">
                            Terms of Service
                        </Link>
                    </div>
                </form>
            ) : (
                <div className="max-w-md mx-auto">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                        <Check className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 font-serif">Success!</h3>
                    <p className="text-sm text-muted-foreground">
                        Thank you! We&apos;ll be in touch soon with exclusive updates.
                    </p>
                </div>
            )}
        </div>
    );
}
