
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Save } from "lucide-react";

const formSchema = z.object({
  userId: z.string().min(1, { message: "Spotify User ID is required." }),
});

type UserIdFormValues = z.infer<typeof formSchema>;

interface CredentialsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userId: string) => void;
}

export function CredentialsDialog({ isOpen, onClose, onSave }: CredentialsDialogProps) {
  const form = useForm<UserIdFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: "",
    },
  });

  function onSubmit(data: UserIdFormValues) {
    onSave(data.userId);
    onClose();
    form.reset();
  }

  // This component is no longer used in the main flow but is kept for potential future use.
  // The app now uses OAuth login.

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-background shadow-neumorphic rounded-lg">
        <DialogHeader>
          <DialogTitle className="font-headline">Spotify User ID</DialogTitle>
          <DialogDescription>
            Enter your Spotify User ID to find your playlists. (This is now handled by login)
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Spotify User ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Spotify User ID" {...field} className="bg-background shadow-neumorphic-inset-sm focus:shadow-neumorphic-inset transition-shadow duration-200" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 shadow-neumorphic-sm hover:shadow-neumorphic-inset-sm active:shadow-neumorphic-inset-sm transition-all duration-200">
                <Save className="mr-2 h-4 w-4" /> Save User ID
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
