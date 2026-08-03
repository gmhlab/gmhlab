import clsx from "clsx";
import type { ComponentPropsWithoutRef } from "react";
import "./forms.css";

export type FormBoxProps = ComponentPropsWithoutRef<"form">;
export function FormBox({ className, ...props }: FormBoxProps) {
  const classNames = clsx(className, "form-box");
  return <form className={classNames} {...props} />;
}
