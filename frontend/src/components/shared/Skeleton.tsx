export default function Skeleton() {
  return (
    <div className="w-full h-full relative overflow-hidden bg-[var(--color-paper)]">
      {/* Grid pattern evoking a blank survey map */}
      <div 
        className="absolute inset-0 opacity-10" 
        style={{
          backgroundImage: 'linear-gradient(var(--color-line) 1px, transparent 1px), linear-gradient(90deg, var(--color-line) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      />
    </div>
  );
}
