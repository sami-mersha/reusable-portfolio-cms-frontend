"use client";

import { useActionState, useEffect, useRef } from "react";
import { MessageSquarePlus, Send } from "lucide-react";

import { submitBlogComment } from "@/app/blogs/actions";
import {
  initialBlogCommentFormState,
  type BlogCommentFormState,
} from "@/app/blogs/comment-form-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const inputClassName =
  "w-full rounded-[1.1rem] border border-border/60 bg-background/70 px-4 text-sm outline-none transition placeholder:text-muted-foreground/75 focus:border-primary/45 focus:ring-4 focus:ring-primary/10";

// Shared inline error helper so field layout stays consistent.
function FieldError({ error }: { error?: string }) {
  if (!error) {
    return null;
  }

  return <p className="text-sm text-destructive">{error}</p>;
}

// Adds error styles without duplicating class names everywhere.
function getFieldClass(error?: string, isTextarea = false) {
  return cn(
    inputClassName,
    isTextarea ? "min-h-36 py-3" : "h-11",
    error ? "border-destructive/60 focus:border-destructive/60 focus:ring-destructive/10" : undefined,
  );
}

export default function BlogCommentForm({ blogId }: { blogId: number }) {
  const formRef = useRef<HTMLFormElement>(null);
  // Bind the blog ID to the server action so the handler knows which post to attach.
  const action = submitBlogComment.bind(null, blogId);
  const [state, formAction, pending] = useActionState<
    BlogCommentFormState,
    FormData
  >(action, initialBlogCommentFormState);

  useEffect(() => {
    // Clear the form on success so users can submit another comment if desired.
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  return (
    <Card className="surface-glow border-white/40 bg-white/70 dark:bg-slate-950/45">
      <CardHeader className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MessageSquarePlus className="size-4 text-primary" />
          Leave a comment
        </div>
        <CardTitle className="text-2xl">Join the conversation</CardTitle>
        <CardDescription className="text-base leading-7">
          New comments are not published automatically until approved.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form ref={formRef} action={formAction} className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="first_name" className="text-sm font-medium">
                First name
              </label>
              <input
                id="first_name"
                name="first_name"
                type="text"
                required
                aria-invalid={Boolean(state.fieldErrors?.first_name)}
                aria-describedby={state.fieldErrors?.first_name ? "first_name-error" : undefined}
                className={getFieldClass(state.fieldErrors?.first_name)}
              />
              <div id="first_name-error">
                <FieldError error={state.fieldErrors?.first_name} />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="last_name" className="text-sm font-medium">
                Last name
              </label>
              <input
                id="last_name"
                name="last_name"
                type="text"
                required
                aria-invalid={Boolean(state.fieldErrors?.last_name)}
                aria-describedby={state.fieldErrors?.last_name ? "last_name-error" : undefined}
                className={getFieldClass(state.fieldErrors?.last_name)}
              />
              <div id="last_name-error">
                <FieldError error={state.fieldErrors?.last_name} />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              aria-invalid={Boolean(state.fieldErrors?.email)}
              aria-describedby={state.fieldErrors?.email ? "email-error" : undefined}
              className={getFieldClass(state.fieldErrors?.email)}
            />
            <div id="email-error">
              <FieldError error={state.fieldErrors?.email} />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="comment" className="text-sm font-medium">
              Comment
            </label>
            <textarea
              id="comment"
              name="comment"
              required
              aria-invalid={Boolean(state.fieldErrors?.comment)}
              aria-describedby={state.fieldErrors?.comment ? "comment-error" : undefined}
              className={getFieldClass(state.fieldErrors?.comment, true)}
            />
            <div id="comment-error">
              <FieldError error={state.fieldErrors?.comment} />
            </div>
          </div>

          {state.message ? (
            <div
              aria-live="polite"
              className={cn(
                "rounded-[1.1rem] border px-4 py-3 text-sm",
                state.status === "success"
                  ? "border-primary/20 bg-primary/8 text-foreground"
                  : "border-destructive/20 bg-destructive/8 text-destructive",
              )}
            >
              {state.message}
            </div>
          ) : null}

          <Button type="submit" disabled={pending} className="w-full sm:w-auto">
            <Send className="size-4" />
            {pending ? "Submitting..." : "Submit comment"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
