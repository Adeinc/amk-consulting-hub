export function Toggle({
  checked,
  onChange,
  label,
  detail,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  detail: string;
}) {
  return (
    <label className="flex items-center justify-between gap-4 py-3.5 border-b border-border last:border-0 cursor-pointer">
      <div>
        <p className="font-semibold text-navy text-sm">{label}</p>
        <p className="text-xs text-navy/50">{detail}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`shrink-0 w-11 h-6 rounded-full transition-colors relative cursor-pointer ${checked ? "gradient-brand" : "bg-navy/15"}`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"}`}
        />
      </button>
    </label>
  );
}
