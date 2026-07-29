export default function DirectionGlyph({ direction }: { direction: 'rise' | 'fall' | 'neutral' }) {
  if (direction === 'neutral') return null;
  
  const color = direction === 'rise' ? 'var(--color-rise)' : 'var(--color-fall)';
  const transform = direction === 'fall' ? 'rotate(180deg)' : 'none';

  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform }}>
      <path d="M8 3L14 11H2L8 3Z" fill={color} />
    </svg>
  );
}
