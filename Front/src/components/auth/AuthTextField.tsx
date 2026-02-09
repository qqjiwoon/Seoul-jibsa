// Front/src/components/auth/AuthTextField.tsx
type Props = {
  label: string;
  icon: string; // material symbol name
  type?: string;
  name?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
};

export default function AuthTextField({
  label,
  icon,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  autoComplete,
}: Props) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-bold text-gray-800 ml-1">{label}</label>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <span className="material-symbols-outlined text-gray-400 text-[22px]">
            {icon}
          </span>
        </div>

        <input
          type={type}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 text-gray-900 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-gray-300"
        />
      </div>
    </div>
  );
}
