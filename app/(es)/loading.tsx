export default function Loading() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[120] h-0.5 overflow-hidden opacity-0 transition-opacity delay-300 duration-200"
    >
      <div className="h-full w-1/3 animate-pulse bg-[#C5A880]" />
    </div>
  );
}
