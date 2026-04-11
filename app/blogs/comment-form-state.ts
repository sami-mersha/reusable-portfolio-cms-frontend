// Field names used for inline validation messages in the comment form.
export type BlogCommentFieldName =
  | "first_name"
  | "last_name"
  | "email"
  | "comment";

// Shared shape for action state so UI can render errors + success messages.
export type BlogCommentFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<BlogCommentFieldName, string>>;
};

// Initial state passed to useActionState.
export const initialBlogCommentFormState: BlogCommentFormState = {
  status: "idle",
};
