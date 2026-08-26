interface ScrollIndexProps {
  progress: number;
}

export default function ScrollIndex({ progress }: ScrollIndexProps) {
  return (
    <aside className="scroll-index">
      <span>01</span>
      <div className="line">
        <b style={{ height: `${Math.max(4, progress * 100)}%` }} />
      </div>
      <span>08</span>
    </aside>
  );
}
