import { useEffect, useRef, useState } from "react";

function Board() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [size, setSize] = useState<Record<string, number>>({
    width: 0,
    height: 0,
  });

  const isDrawing = useRef(false);
  const lastX = useRef(0);
  const lastY = useRef(0);

  function handleMouseDown(e: React.PointerEvent<HTMLCanvasElement>) {
    isDrawing.current = true;
    lastX.current = e.nativeEvent.offsetX;
    lastY.current = e.nativeEvent.offsetY;
  }

  function handleMouseMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!isDrawing.current) return;

    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    const ctx = canvasRef.current?.getContext("2d");

    ctx?.beginPath();
    ctx?.moveTo(lastX.current, lastY.current);
    ctx?.lineTo(x, y);
    ctx?.stroke();

    lastX.current = x;
    lastY.current = y;
  }

  function handleMouseUp() {
    isDrawing.current = false;
  }

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setSize({ width, height });
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || size.width === 0 || size.height === 0) return;

    canvas.width = size.width;
    canvas.height = size.height;

    const ctx = canvas.getContext("2d");
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
  }, [size]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 flex items-center justify-center bg-black"
    >
      <canvas
        ref={canvasRef}
        className="object-contain h-full w-full max-w-full max-h-full bg-white touch-none"
        onPointerDown={handleMouseDown}
        onPointerMove={handleMouseMove}
        onPointerUp={handleMouseUp}
      />
    </div>
  );
}

export default Board;
