"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";

type ConsultationDialogProps = {
  appointmentId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type FormValues = {
  symptoms: string;
  diagnosis: string;
  prescription: string;
  notes: string;
};

export function ConsultingDialog({
  open,
  onOpenChange,
}: ConsultationDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams(); // ✅ Grab appointmentId from the route
  const appointmentId = params?.id as string;

  const form = useForm<FormValues>({
    defaultValues: {
      symptoms: "",
      diagnosis: "",
      prescription: "",
      notes: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `/api/appointments/${appointmentId}`, // ✅ Use the appointmentId from the route
        {
          method: "PUT", // ✅ Changed to PUT
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update consultation");
      }

      const updated = await response.json();
      console.log("Consultation updated:", updated);

      router.refresh();

      toast({
        title: "Success",
        description: "Consultation uploaded successfully",
        duration: 3000,
      });

      onOpenChange(false);
      form.reset();
      router.push("/doctor/timelines");
    } catch (error) {
      console.error("Error updating consultation:", error);
      toast({
        title: "Error",
        description: "Failed to upload consultation",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
      router.refresh();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book Appointment for</DialogTitle>
          <DialogDescription>
            Fill in the details below to schedule a new appointment.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <h3 className="mb-2 text-lg font-medium">Vital Signs</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="symptoms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Symptoms</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g. Fever, Cough"
                            {...field}
                            className="h-24"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="diagnosis"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Diagnosis</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Hypertension - Controlled"
                            {...field}
                            className="h-24"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="prescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prescription</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Lisinopril 10mg"
                            {...field}
                            className="h-24"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Extra Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g. Follow up in 2 weeks"
                            {...field}
                            className="h-24"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Upload Consultation"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
