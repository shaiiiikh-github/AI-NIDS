import { Switch } from "@/components/ui/switch";

interface SettingToggleProps {
  label: string;
  checked: boolean;
  onToggle: (checked: boolean) => void;
}

export const SettingToggle: React.FC<SettingToggleProps> = ({ label, checked, onToggle }) => {
  return (
    <label className="flex items-center gap-2 text-sm text-neutral-300">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onToggle(e.target.checked)}
        className="w-4 h-4 accent-primary"
      />
      {label}
    </label>
  );
};