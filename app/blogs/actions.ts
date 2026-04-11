"use server";

import { createBlogComment } from "@/app/_lib/blogs";
import { logServerError } from "@/app/_lib/errors";

import type { BlogCommentFormState } from "./comment-form-state";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Safe string extraction from form data (avoids non-string values).
function getFormValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

// Server Action for comment submissions.
export async function submitBlogComment(
  blogId: number,
  _previousState: BlogCommentFormState,
  formData: FormData,
): Promise<BlogCommentFormState> {
  if (!Number.isInteger(blogId) || blogId <= 0) {
    return {
      status: "error",
      message: "We couldn't match this comment to a valid blog post.",
    };
  }

  const first_name = getFormValue(formData, "first_name");
  const last_name = getFormValue(formData, "last_name");
  const email = getFormValue(formData, "email");
  const comment = getFormValue(formData, "comment");

  const fieldErrors: BlogCommentFormState["fieldErrors"] = {};

  if (!first_name) {
    fieldErrors.first_name = "First name is required.";
  }

  if (!last_name) {
    fieldErrors.last_name = "Last name is required.";
  }

  if (!email) {
    fieldErrors.email = "Email is required.";
  } else if (!emailPattern.test(email)) {
    fieldErrors.email = "Please enter a valid email address.";
  }

  if (!comment) {
    fieldErrors.comment = "Comment is required.";
  } else if (comment.length < 10) {
    fieldErrors.comment = "Please share at least 10 characters.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Please correct the highlighted fields and try again.",
      fieldErrors,
    };
  }

  try {
    const response = await createBlogComment({
      blog_id: blogId,
      first_name,
      last_name,
      email,
      comment,
    });

    return {
      status: "success",
      message: response.message,
    };
  } catch (error) {
    logServerError("Blog comment submission failed", error);

    return {
      status: "error",
      message: "We couldn't submit your comment right now. Please try again shortly.",
    };
  }
}
