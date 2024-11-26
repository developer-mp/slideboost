import { InputHTMLAttributes } from "react";
import { FormControlProps } from "react-bootstrap";

export type PasswordInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size"
> &
  FormControlProps;

export type MenuItem = "dashboard" | "media" | "templates" | "projects";
