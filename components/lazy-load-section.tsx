"use client";

import { useState, useEffect, useRef } from "react";

interface LazyLoadSectionProps {
    children: React.ReactNode;
    className?: string;
}

export default function LazyLoadSection({ children, className }: LazyLoadSectionProps) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // 1. Interaction / Viewport Trigger
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin: "200px" } // Load when 200px away
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        // 2. Idle Callback Trigger (Optimistic preloading when CPU is free)
        const idleCallback = (window as any).requestIdleCallback;
        let idleId: number;

        if (idleCallback) {
            idleId = idleCallback(() => {
                setIsVisible(true);
            }, { timeout: 4000 }); // Force load after 4s idle max
        } else {
            // Fallback for Safari/older browsers
            idleId = window.setTimeout(() => {
                setIsVisible(true);
            }, 4000);
        }

        return () => {
            if (ref.current) observer.disconnect();
            if (idleCallback) (window as any).cancelIdleCallback(idleId);
            else clearTimeout(idleId);
        };
    }, []);

    return (
        <div ref={ref} className={className}>
            {isVisible ? children : null}
        </div>
    );
}
