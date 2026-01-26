import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || "fallback_secret";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <div className="flex-1 pt-24 pb-16">
                {children}
            </div>
            <Footer />
        </div>
    );
}
