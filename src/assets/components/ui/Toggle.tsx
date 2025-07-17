import * as React from "react";
import { cn } from "../../utils/cn";

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: () => void;
  className?: string;
}

const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(
  ({ label, checked, onChange, className, ...props }, ref) => (
    <div className={cn("flex items-center space-x-2", className)}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        ref={ref}
        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        {...props}
      />
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
    </div>
  )
);

Toggle.displayName = "Toggle";

export default Toggle;
