export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: "Login" | "Register";
  isSubmitting?: boolean;
}