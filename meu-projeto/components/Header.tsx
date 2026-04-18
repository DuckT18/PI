export default function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-[#111316] flex justify-between items-center px-6 h-16">
      <div className="flex items-center gap-4">
        <button className="text-[#b0c6ff] p-2 rounded-full">
          ☰
        </button>
        <span className="text-sm font-bold text-[#b0c6ff] uppercase">
          Automate
        </span>
      </div>
    </header>
  );
}