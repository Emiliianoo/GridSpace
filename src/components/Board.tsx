import { useEffect, useRef, useState } from "react";
import Toolbar from "./Toolbar";

type Point = {
  x: number;
  y: number;
};

type Stroke = {
  points: Point[];
};

function Board() {
  const [strokes, setStrokes] = useState<Stroke[]>([]);

  const currentStroke = useRef<Stroke>({ points: [] });

  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [size, setSize] = useState<Record<string, number>>({
    width: 0,
    height: 0,
  });

  const isDrawing = useRef(false);
  const lastX = useRef(0);
  const lastY = useRef(0);

  function redraw() {
    const canvas = canvasRef.current;
    if (!canvas || strokes.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.beginPath();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const stroke of strokes) {
      if (stroke.points.length === 0) continue;

      const firstPoint = stroke.points[0];

      ctx.beginPath();
      ctx.arc(firstPoint.x, firstPoint.y, 0.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.moveTo(firstPoint.x, firstPoint.y);

      for (let i = 1; i < stroke.points.length; i++) {
        const point = stroke.points[i];

        ctx.lineTo(point.x, point.y);
      }

      ctx.stroke();
    }
  }

  function handleMouseDown(e: React.PointerEvent<HTMLCanvasElement>) {
    isDrawing.current = true;
    lastX.current = e.nativeEvent.offsetX;
    lastY.current = e.nativeEvent.offsetY;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.beginPath();
    ctx.arc(lastX.current, lastY.current, 0.5, 0, Math.PI * 2);
    ctx.fill();

    const currentPoint: Point = { x: lastX.current, y: lastY.current };
    currentStroke.current.points.push(currentPoint);
  }

  function handleMouseMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!isDrawing.current) return;

    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(lastX.current, lastY.current);
    ctx.lineTo(x, y);
    ctx.stroke();

    lastX.current = x;
    lastY.current = y;
    const currentPoint: Point = { x: lastX.current, y: lastY.current };
    currentStroke.current.points.push(currentPoint);
  }

  function handleMouseUp() {
    isDrawing.current = false;

    setStrokes((prev) => [...prev, currentStroke.current]);

    currentStroke.current = { points: [] };
  }

  function handleClear() {
    const canvas = canvasRef.current;
    if (!canvas || strokes.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.beginPath();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
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

    redraw();
  }, [size]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 flex items-center justify-center bg-black"
    >
      <Toolbar onClear={handleClear} />
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
