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
  clientId: z.string().min(1, { message: "Client ID is required." }),
  clientSecret: z.string().min(1, { message: "Client Secret is required." }),
  userId: z.string().min(1, { message: "Spotify User ID is required." }),
});

type CredentialsFormValues = z.infer<typeof formSchema>;

interface CredentialsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CredentialsFormValues) => void;
}

export function CredentialsDialog({ isOpen, onClose, onSave }: CredentialsDialogProps) {
  const form = useForm<CredentialsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientId: "",
      clientSecret: "",
      userId: "",
    },
  });

  function onSubmit(data: CredentialsFormValues) {
    onSave(data);
    onClose();
    form.reset();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-background shadow-neumorphic rounded-lg">
        <DialogHeader>
          <DialogTitle className="font-headline">Spotify API Credentials</DialogTitle>
          <DialogDescription>
            Enter your Spotify Web API credentials to continue. You can find these on your Spotify Developer Dashboard.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Spotify Client ID" {...field} className="bg-background shadow-neumorphic-inset-sm focus:shadow-neumorphic-inset transition-shadow duration-200" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="clientSecret"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Secret</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Your Spotify Client Secret" {...field} className="bg-background shadow-neumorphic-inset-sm focus:shadow-neumorphic-inset transition-shadow duration-200" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                <Save className="mr-2 h-4 w-4" /> Save Credentials
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
