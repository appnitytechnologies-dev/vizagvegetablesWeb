'use client';
import { useRef, useCallback } from 'react';

export default function DragScroll({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref   = useRef<HTMLDivElement>(null);
  const drag  = useRef({ active: false, startX: 0, scrollLeft: 0 });

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    const el = ref.current; if (!el) return;
    drag.current = { active: true, startX: e.pageX - el.offsetLeft, scrollLeft: el.scrollLeft };
    el.style.cursor = 'grabbing';
  }, []);

  const onMouseUp = useCallback(() => {
    drag.current.active = false;
    if (ref.current) ref.current.style.cursor = 'grab';
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!drag.current.active || !ref.current) return;
    e.preventDefault();
    const x    = e.pageX - ref.current.offsetLeft;
    const walk = (x - drag.current.startX) * 1.2;
    ref.current.scrollLeft = drag.current.scrollLeft - walk;
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      onMouseDown={onMouseDown}
      onMouseLeave={onMouseUp}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
    >
      {children}
    </div>
  );
}
