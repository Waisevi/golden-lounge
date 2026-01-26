"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

interface MenuModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

type DbCategory = {
    id: string;
    name: string;
    menu_type: string;
    items: {
        id: string;
        name: string;
        description: string;
        price: string;
    }[];
};

export function MenuModal({ isOpen, onOpenChange }: MenuModalProps) {
    const [menuData, setMenuData] = useState<DbCategory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isOpen) return;

        async function fetchMenu() {
            const { data, error } = await supabase
                .from("menu_categories")
                .select(`
                    id,
                    name,
                    menu_type,
                    menu_items (
                        id,
                        name,
                        description,
                        price
                    )
                `)
                .order("order", { ascending: true });

            if (error) {
                console.error("Error fetching menu:", error.message);
            } else if (data) {
                const mapped = data.map((cat: any) => ({
                    ...cat,
                    items: cat.menu_items || []
                }));
                setMenuData(mapped);
            }
            setLoading(false);
        }

        fetchMenu();
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-card border-border/50 p-0 flex flex-col rounded-3xl">
                <DialogHeader className="p-6 border-b border-border/40 shrink-0 flex flex-row items-center justify-between">
                    <div>
                        <DialogTitle className="text-3xl font-bold font-serif text-foreground">
                            Full Menu
                        </DialogTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                            Premium flavors curated for your nightlife experience.
                        </p>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-10 scrollbar-thin scrollbar-thumb-primary/20">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="w-10 h-10 text-primary animate-spin" />
                            <p className="text-muted-foreground uppercase tracking-widest text-xs font-bold">Loading Menu...</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
                            {menuData.map((category) => (
                                <div key={category.id} className="space-y-8">
                                    <div className="flex items-center gap-4">
                                        <h2 className="text-2xl font-bold text-primary font-serif italic tracking-wide">
                                            {category.name}
                                        </h2>
                                        <div className="h-px flex-1 bg-primary/20" />
                                    </div>

                                    <ul className="space-y-4">
                                        {category.items.map((item) => (
                                            <li key={item.id} className="group">
                                                <div className="flex justify-between items-baseline mb-1">
                                                    <h3 className="font-bold text-foreground group-hover:text-primary transition-colors uppercase tracking-wider text-sm">
                                                        {item.name}
                                                    </h3>
                                                    {item.price && (
                                                        <span className="text-accent font-bold text-sm ml-4">
                                                            {item.price}
                                                        </span>
                                                    )}
                                                </div>
                                                {item.description && (
                                                    <p className="text-muted-foreground text-xs leading-relaxed italic">
                                                        {item.description}
                                                    </p>
                                                )}
                                                <div className="h-px w-full bg-border/10 mt-3" />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mt-16 pt-8 border-t border-border/40 text-center">
                        <p className="text-xs text-muted-foreground italic">
                            * Consuming raw or undercooked meats, poultry, seafood, shellfish, or eggs may increase your risk of foodborne illness.
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
