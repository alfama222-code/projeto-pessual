"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";

interface RippleCell {
  row: number;
  col: number;
  delay: number;
}

export function BackgroundRippleEffect() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ripples, setRipples] = useState<RippleCell[]>([]);
  const [clickedCells, setClickedCells] = useState<Set<string>>(new Set());
  
  const rows = 12;
  const cols = 20;

  const triggerRipple = useCallback((originRow: number, originCol: number) => {
    const newRipples: RippleCell[] = [];
    const maxDist = Math.sqrt(rows * rows + cols * cols);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const dist = Math.sqrt(
          (r - originRow) ** 2 + (c - originCol) ** 2
        );
        newRipples.push({
          row: r,
          col: c,
          delay: (dist / maxDist) * 600,
        });
      }
    }

    setRipples(newRipples);

    // Clear ripples after animation
    setTimeout(() => {
      setRipples([]);
    }, 1500);
  }, []);

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      const key = `${row}-${col}`;
      setClickedCells((prev) => {
        const next = new Set(prev);
        if (next.has(key)) {
          next.delete(key);
        } else {
          next.add(key);
        }
        return next;
      });
      triggerRipple(row, col);
    },
    [triggerRipple]
  );

  const getRippleDelay = useCallback(
    (row: number, col: number): number | null => {
      const cell = ripples.find((r) => r.row === row && r.col === col);
      return cell ? cell.delay : null;
    },
    [ripples]
  );

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 overflow-hidden"
      style={{ perspective: "800px" }}
    >
      <div
        className="grid h-full w-full"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          gap: "1px",
        }}
      >
        {Array.from({ length: rows * cols }).map((_, idx) => {
          const row = Math.floor(idx / cols);
          const col = idx % cols;
          const key = `${row}-${col}`;
          const isClicked = clickedCells.has(key);
          const rippleDelay = getRippleDelay(row, col);

          return (
            <div
              key={key}
              onClick={() => handleCellClick(row, col)}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.backgroundColor = "rgba(245, 158, 11, 0.15)";
                el.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                if (!isClicked) {
                  el.style.backgroundColor = "rgba(245, 158, 11, 0.03)";
                }
                el.style.transform = "scale(1)";
              }}
              className="cursor-pointer rounded-sm transition-all duration-300 ease-out"
              style={{
                backgroundColor: isClicked
                  ? "rgba(245, 158, 11, 0.2)"
                  : "rgba(245, 158, 11, 0.03)",
                border: "1px solid rgba(245, 158, 11, 0.06)",
                transition: `all 0.3s ease-out`,
                animation:
                  rippleDelay !== null
                    ? `ripplePulse 0.8s ease-out ${rippleDelay}ms both`
                    : "none",
              }}
            />
          );
        })}
      </div>

      <style jsx>{`
        @keyframes ripplePulse {
          0% {
            transform: scale(1);
            background-color: rgba(245, 158, 11, 0.03);
          }
          50% {
            transform: scale(1.15);
            background-color: rgba(245, 158, 11, 0.25);
          }
          100% {
            transform: scale(1);
            background-color: rgba(245, 158, 11, 0.03);
          }
        }
      `}</style>
    </div>
  );
}
