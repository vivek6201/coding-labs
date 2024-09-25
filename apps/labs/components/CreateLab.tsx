"use client";
import React, { useState } from "react";
import { Button } from "@ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/components/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/components/form";
import { Input } from "@ui/components/input";
import { hookForm, zodResolver } from "@ui/index";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/components/select";

import { z } from "zod";
import { validations } from "@repo/lib/src/index";
import axios from "axios";
import { useToast } from "@ui/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

function CreateLab() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = hookForm.useForm<
    z.infer<typeof validations.createLabValidations>
  >({
    resolver: zodResolver(validations.createLabValidations),
    defaultValues: {
      slug: "",
      template: "",
    },
  });

  async function onSubmit(
    values: z.infer<typeof validations.createLabValidations>
  ) {
    setLoading(true);
    try {
      const res = await axios.post("/api/create", {
        slug: values.slug,
        template: values.template,
      });

      if (res.data.success) {
        toast({
          title: "Lab created Successfully!",
        });
        setOpen(false);
        form.reset();

        console.log(res.data);
        router.push(`dashboard/coding/${values.slug}`);
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Something went wrong!",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Lab</Button>
      </DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Create a Lab</DialogTitle>
          <DialogDescription>
            This is where you will create your playground
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Project Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="template"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Template</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a Template" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="nodejs">NodeJS</SelectItem>
                      <SelectItem value="react">ReactJS</SelectItem>
                      <SelectItem value="cpp">CPP</SelectItem>
                      <SelectItem value="python">python</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button onClick={() => setOpen(false)} type="button" disabled={loading}>
                Close
              </Button>
              <Button
                type="submit"
                className="flex gap-2 items-center"
                disabled={loading}
              >
                {loading && <Loader className="animate-spin"/>}
                Create Lab
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateLab;
