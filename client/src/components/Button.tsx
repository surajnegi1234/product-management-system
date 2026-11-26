import { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "danger";

export function buttonClassName(variant: ButtonVariant = "secondary"): string {
  return "btn btn-" + variant;
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export function Button({ variant = "secondary", className, type = "button", ...rest }: ButtonProps) {
  const classes = className ? buttonClassName(variant) + " " + className : buttonClassName(variant);
  return <button type={type} className={classes} {...rest} />;
}
