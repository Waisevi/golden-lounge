"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { LeadForm } from "@/components/lead-form";

interface ReserveModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReserveModal({ isOpen, onOpenChange }: ReserveModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 border-0 bg-transparent">
        <DialogTitle className="sr-only">Join the VIP List</DialogTitle>
        <div className="bg-background border border-border/50 rounded-3xl p-6 lg:p-8">
          <LeadForm
            formType="vip"
            title="Join the VIP List"
            description="Be the first to know about exclusive events, special offers, and priority reservations."
            buttonText="Join VIP List"
            className=""
            onSuccess={() => onOpenChange(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
