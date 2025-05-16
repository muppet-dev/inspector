import { cn } from "@/client/lib/utils";
import type { PropsWithChildren } from "react";
import { useFormContext } from "react-hook-form";
import { useCustomForm } from "./provider";

export function FormWrapper(props: PropsWithChildren<{ className?: string }>) {
  const { handleSubmit } = useFormContext();

  const mutation = useCustomForm();

  return (
    <form
      id="request-form"
      onSubmit={handleSubmit(
        (values) => mutation.mutateAsync(values),
        console.error
      )}
      className={cn("h-full w-full", props.className)}
    >
      {props.children}
    </form>
  );
}
