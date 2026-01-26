"use client";

import Image from "next/image";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

interface ImageModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    src: string;
    alt: string;
}

export function ImageModal({
    isOpen,
    onOpenChange,
    src,
    alt,
}: ImageModalProps) {
    if (!src) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 overflow-hidden border-none bg-transparent shadow-none">
                <div className="relative w-full h-full flex items-center justify-center">
                    {/* We use a container that scales based on screen size while maintaining aspect ratio if possible */}
                    <div className="relative w-full aspect-video sm:aspect-[4/3] lg:aspect-auto h-auto max-h-[90vh]">
                        <Image
                            src={src}
                            alt={alt}
                            width={1920}
                            height={1080}
                            className="w-full h-full object-contain rounded-lg"
                            priority
                        />
                    </div>
                </div>

                {/* Hidden titles for accessibility */}
                <DialogHeader className="sr-only">
                    <DialogTitle>{alt}</DialogTitle>
                    <DialogDescription>Full size image preview</DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
