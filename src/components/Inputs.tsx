import { forwardRef, InputHTMLAttributes } from "react";
interface InputsProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Inputs = forwardRef<HTMLInputElement, InputsProps>(
  ({ label, id, type = "text", ...rest }, ref) => {
    return (
      <div className="text-sm flex flex-col justify-center flex-1 gap-1 w-full">
        <label htmlFor={id} className="text-sm text-slate-50 ml-1">
          {label}
        </label>
        <input
          ref={ref} // Conecta o Hook Form ao input
          id={id}
          type={type}
          className="border text-slate-400 w-full bg-slate-950 text-sm border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:border-slate-600"
          {...rest} // Passa todas as outras props (placeholder, onChange, name, etc)
        />
      </div>
    );
  },
);

Inputs.displayName = "Inputs";
