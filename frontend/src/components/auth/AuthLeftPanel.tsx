export default function AuthRightPanel() {
  return (
    <div className="hidden md:flex relative overflow-hidden bg-linear-to-br from-gray-100 to-orange-50/20 px-16 py-20">
      {/* Text block */}
      <div className="relative z-10 max-w-md space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Budget smarter.</h2>

        <p className="text-sm text-muted-foreground leading-relaxed">
          A clean and modern way to manage your money with envelope-based budgeting.
        </p>
      </div>

      {/* Screenshot */}
      <div
        className="
        absolute 
        bottom-0
        right-0 
        w-[700px] 
        bg-orange-400 
        rounded-tl-3xl 
        rounded-br-3xl 
        shadow-2xl
        overflow-hidden
      "
      >
        <div className="h-130"></div>
      </div>
    </div>
  );
}
