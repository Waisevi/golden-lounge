"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Plus,
    Pencil,
    Trash2,
    Calendar as CalendarIcon,
    Clock,
    Tag,
    Image as ImageIcon,
    Loader2,
    AlertCircle,
    LogOut,
    Upload,
    X
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { getAssetUrl } from "@/lib/assets";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";

type Event = {
    id: string;
    title: string;
    date: string;
    time: string;
    description: string;
    image: string;
    category: string;
};

export default function AdminDashboard() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const router = useRouter();

    const handleLogout = async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        toast.success("Logged out successfully");
        router.push("/admin/login");
        router.refresh();
    };

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        date: "",
        time: "",
        description: "",
        image: "",
        category: "Exclusive Night",
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const fetchEvents = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("events")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            toast.error("Failed to fetch events");
        } else {
            setEvents(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const resetForm = () => {
        setFormData({
            title: "",
            date: "",
            time: "",
            description: "",
            image: "",
            category: "Exclusive Night",
        });
        setSelectedFile(null);
        setImagePreview(null);
        setEditingEvent(null);
    };

    const handleEdit = (event: Event) => {
        setEditingEvent(event);
        setFormData({
            title: event.title,
            date: event.date,
            time: event.time,
            description: event.description,
            image: event.image,
            category: event.category,
        });
        setSelectedFile(null);
        setImagePreview(event.image ? getAssetUrl(event.image) : null);
        setIsDialogOpen(true);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error("Please select an image file");
                return;
            }
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error("File size must be less than 5MB");
                return;
            }
            setSelectedFile(file);
            // Clear URL field when file is selected
            setFormData({ ...formData, image: "" });
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadImageToSupabase = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/admin/upload-image", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Failed to upload image");
        }

        const data = await response.json();
        return data.path;
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this event?")) return;

        const { error } = await supabase.from("events").delete().eq("id", id);

        if (error) {
            toast.error("Failed to delete event");
        } else {
            toast.success("Event deleted");
            fetchEvents();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setIsUploading(true);

        try {
            let imagePath = formData.image;

            // Upload file if selected
            if (selectedFile) {
                try {
                    imagePath = await uploadImageToSupabase(selectedFile);
                    toast.success("Image uploaded successfully");
                } catch (uploadError: any) {
                    toast.error(uploadError.message || "Failed to upload image");
                    setIsUploading(false);
                    setIsSubmitting(false);
                    return;
                }
            }

            // If no file selected and no existing image path, show error
            if (!imagePath && !selectedFile) {
                toast.error("Please select an image file or provide an image URL");
                setIsUploading(false);
                setIsSubmitting(false);
                return;
            }

            const dataToSave = {
                ...formData,
                image: imagePath,
            };

            if (editingEvent) {
                const { error } = await supabase
                    .from("events")
                    .update(dataToSave)
                    .eq("id", editingEvent.id);

                if (error) throw error;
                toast.success("Event updated");
            } else {
                const { error } = await supabase.from("events").insert([dataToSave]);

                if (error) throw error;
                toast.success("Event created");
            }
            setIsDialogOpen(false);
            resetForm();
            fetchEvents();
        } catch (error: any) {
            toast.error(error.message || "Operation failed");
        } finally {
            setIsSubmitting(false);
            setIsUploading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div className="flex items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-bold text-foreground font-serif tracking-tight">
                            Events Management
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Create, update, and manage your lounge's upcoming experiences.
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleLogout}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                        title="Logout"
                    >
                        <LogOut className="w-5 h-5" />
                    </Button>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) resetForm();
                }}>
                    <DialogTrigger asChild>
                        <Button className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-6 font-bold flex items-center gap-2 shadow-lg shadow-primary/20 transition-all hover:scale-105">
                            <Plus className="w-5 h-5" />
                            New Event
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] border-border/50 bg-card/95 backdrop-blur-xl">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-serif">
                                {editingEvent ? "Edit Event" : "Create New Event"}
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-6 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Title</label>
                                    <Input
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="e.g. Neon Nights"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Category</label>
                                    <Input
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        placeholder="e.g. Exclusive Night"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Date</label>
                                    <Input
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        placeholder="e.g. Every Friday"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Time</label>
                                    <Input
                                        value={formData.time}
                                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                        placeholder="e.g. 10 PM - 3 AM"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Description</label>
                                <Textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Tell guests what to expect..."
                                    className="min-h-[100px]"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Image</label>
                                
                                {/* File Input */}
                                <div className="flex gap-4">
                                    <div className="relative flex-1">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileSelect}
                                            className="hidden"
                                            id="image-upload"
                                        />
                                        <label
                                            htmlFor="image-upload"
                                            className="flex items-center justify-center gap-2 w-full h-12 px-4 border border-border/50 rounded-lg bg-background hover:bg-accent cursor-pointer transition-colors"
                                        >
                                            <Upload className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-sm text-muted-foreground">
                                                {selectedFile ? selectedFile.name : "Choose image file"}
                                            </span>
                                        </label>
                                    </div>
                                </div>


                                {/* Image Preview */}
                                {imagePreview && (
                                    <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border/50 bg-card">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2 h-8 w-8"
                                            onClick={() => {
                                                setSelectedFile(null);
                                                setImagePreview(null);
                                                setFormData({ ...formData, image: "" });
                                                // Reset file input
                                                const fileInput = document.getElementById('image-upload') as HTMLInputElement;
                                                if (fileInput) fileInput.value = '';
                                            }}
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                )}

                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">
                                    {isUploading && "Uploading image..."}
                                    {!isUploading && "Upload an image file or provide a URL. Max file size: 5MB"}
                                </p>
                            </div>

                            <DialogFooter>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 rounded-xl"
                                >
                                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (editingEvent ? "Save Changes" : "Create Event")}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                    <p className="text-muted-foreground uppercase tracking-widest text-sm font-bold">Synchronizing Database...</p>
                </div>
            ) : events.length === 0 ? (
                <Card className="border-dashed border-2 py-24 text-center bg-card/30">
                    <CardContent>
                        <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-bold font-serif">No Events Found</h3>
                        <p className="text-muted-foreground mt-2">Start by creating your first event to showcase on the main page.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map((event) => (
                        <Card key={event.id} className="group overflow-hidden border-border/50 bg-card/80 hover:border-primary/40 transition-all duration-300 shadow-xl">
                            <div className="relative aspect-video overflow-hidden">
                                <Image
                                    src={getAssetUrl(event.image)}
                                    alt={event.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="bg-background/80 backdrop-blur-md text-foreground text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border border-border/50">
                                        {event.category}
                                    </span>
                                </div>
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        className="rounded-full shadow-lg hover:scale-110 active:scale-90 transition-all"
                                        onClick={() => handleEdit(event)}
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="destructive"
                                        className="rounded-full shadow-lg hover:scale-110 active:scale-90 transition-all"
                                        onClick={() => handleDelete(event.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                            <CardHeader className="p-6">
                                <CardTitle className="text-2xl font-bold font-serif mb-4 leading-tight">
                                    {event.title}
                                </CardTitle>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                        <CalendarIcon className="w-4 h-4 text-primary/60" />
                                        <span>{event.date}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                        <Clock className="w-4 h-4 text-primary/60" />
                                        <span>{event.time}</span>
                                    </div>
                                </div>
                                <p className="mt-6 text-sm text-muted-foreground line-clamp-3 leading-relaxed italic">
                                    &ldquo;{event.description}&rdquo;
                                </p>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
