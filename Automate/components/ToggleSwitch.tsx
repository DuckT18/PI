"use client";

interface ToggleSwitchProps {
  isOn: boolean;
  onToggle: () => void;
}

export default function ToggleSwitch({ isOn, onToggle }: ToggleSwitchProps) {
  return (
    <button
      onClick={onToggle}
      className={`toggle-track ${isOn ? "active" : ""}`}
      aria-label={isOn ? "Desligar" : "Ligar"}
    >
      <span className="toggle-thumb" />
    </button>
  );
}
