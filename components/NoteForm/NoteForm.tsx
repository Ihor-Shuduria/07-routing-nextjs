import { Formik, Form, Field, ErrorMessage as FE } from "formik";
import * as Yup from "yup";
import css from "./NoteForm.module.css";
import { createNote } from "../../lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateNoteInput } from "@/lib/api";

interface NoteFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const schema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Min 3 chars")
    .max(50, "Max 50 chars")
    .required("Required"),
  content: Yup.string().max(500, "Max 500 chars"),
  tag: Yup.string()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
    .required("Required"),
});

export default function NoteForm({ onSuccess, onCancel }: NoteFormProps) {
  const qc = useQueryClient();

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: createNote,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["notes"] });
      onSuccess();
    },
  });

  return (
    <div>
      <h2 className={css.heading}>Create note</h2>
      <Formik<CreateNoteInput>
        initialValues={{ title: "", content: "", tag: "Todo" }}
        validationSchema={schema}
        onSubmit={async (values, { setSubmitting, setErrors, resetForm }) => {
          try {
            await mutateAsync(values);
            resetForm();
          } catch (err: unknown) {
            const message =
              err instanceof Error ? err.message : "Failed to create note";
            setErrors({ title: message });
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className={css.form}>
            <div className={css.formGroup}>
              <label htmlFor="title">Title</label>
              <Field id="title" name="title" className={css.input} />
              <FE name="title" component="div" className={css.error} />
            </div>

            <div className={css.formGroup}>
              <label htmlFor="content">Content</label>
              <Field
                as="textarea"
                id="content"
                name="content"
                rows={6}
                className={css.textarea}
              />
              <FE name="content" component="div" className={css.error} />
            </div>

            <div className={css.formGroup}>
              <label htmlFor="tag">Tag</label>
              <Field as="select" id="tag" name="tag" className={css.select}>
                <option value="Todo">Todo</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Meeting">Meeting</option>
                <option value="Shopping">Shopping</option>
              </Field>
              <FE name="tag" component="div" className={css.error} />
            </div>

            {error && (
              <div className={css.error}>
                {(error as Error).message || "Failed to create note."}
              </div>
            )}

            <div className={css.actions}>
              <button
                type="button"
                className={css.cancelButton}
                onClick={onCancel}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={css.submitButton}
                disabled={isSubmitting || isPending}
              >
                {isPending ? "Creating..." : "Create note"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
