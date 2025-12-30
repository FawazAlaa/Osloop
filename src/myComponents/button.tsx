import { ButtonProps } from "@/lib/interfaces/buttonprops";
import actionarray from  "../myFuncs/clsx";


export const Button: React.FC<ButtonProps> = ({
  label,
  className,
  type = "submit",
  isSubmitting,
  ...props
}) => (
  <button
    type={type}
    className={actionarray(
      `disabled:bg-gray-400 bg-linear-to-r from-blue-600 to-blue-800 shadow-lg hover:shadow-blue-400/50 px-4 py-3 rounded-lg w-full font-semibold text-white transition duration-300 disabled:cursor-not-allowed`,
      className
    )}
    {...props}
    disabled={isSubmitting}
  >
    {isSubmitting ? "Registering..." : label}
  </button>
);
