import { useEffect, useRef, useState } from "react";
import Toolbar, { type Tool } from "./Toolbar";
import { type ColorResult } from "react-color";

type Point = {
  x: number;
  y: number;
};

type Stroke = {
  points: Point[];
  type: "pen" | "eraser";
  color?: string;
  width: number;
};

function Board() {
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [type, setType] = useState<Tool>("pen");
  const [color, setColor] = useState<string>("#000000");
  const [width, setWidth] = useState<number>(5);
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);

  const redoStack = useRef<Stroke[]>([]);

  const currentStroke = useRef<Stroke | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [size, setSize] = useState<Record<string, number>>({
    width: 0,
    height: 0,
  });

  const isDrawing = useRef<boolean>(false);
  const lastX = useRef<number>(0);
  const lastY = useRef<number>(0);

  function redraw() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const stroke of strokes) {
      if (stroke.points.length === 0) continue;

      const firstPoint = stroke.points[0];

      ctx.beginPath();

      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.lineWidth = stroke.width;

      if (stroke.type === "eraser") {
        ctx.globalCompositeOperation = "destination-out";
      } else {
        ctx.globalCompositeOperation = "source-over";
        if (stroke.color) ctx.strokeStyle = stroke.color;
      }

      if (stroke.color) {
        ctx.strokeStyle = stroke.color;
        ctx.fillStyle = stroke.color;
      }

      ctx.fill();

      ctx.moveTo(firstPoint.x, firstPoint.y);

      for (let i = 1; i < stroke.points.length; i++) {
        const point = stroke.points[i];

        ctx.lineTo(point.x, point.y);
      }

      ctx.stroke();
    }

    ctx.globalCompositeOperation = "source-over";
  }

  function handleMouseDown(e: React.PointerEvent<HTMLCanvasElement>) {
    redoStack.current = [];
    setShowColorPicker(false);

    isDrawing.current = true;
    lastX.current = e.nativeEvent.offsetX;
    lastY.current = e.nativeEvent.offsetY;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.beginPath();

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.lineWidth = width;

    if (type === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = color;
    }

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.arc(lastX.current, lastY.current, width / 2, 0, Math.PI * 2);
    ctx.fill();

    currentStroke.current = {
      points: [],
      type,
      color: type != "eraser" ? color : undefined,
      width,
    };

    const currentPoint: Point = { x: lastX.current, y: lastY.current };
    currentStroke.current.points.push(currentPoint);
  }

  function handleMouseMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!isDrawing.current) return;

    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    if (type === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = color;
    }

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.moveTo(lastX.current, lastY.current);
    ctx.lineTo(x, y);
    ctx.stroke();

    lastX.current = x;
    lastY.current = y;
    const currentPoint: Point = { x: lastX.current, y: lastY.current };

    if (!currentStroke.current) return;

    currentStroke.current.points.push(currentPoint);
  }

  function handleMouseUp() {
    isDrawing.current = false;

    if (!currentStroke.current) return;

    const stroke = currentStroke.current;

    setStrokes((prev) => [...prev, stroke]);

    currentStroke.current = null;
  }

  function handleChangeColor(newColor: ColorResult) {
    const hex = newColor.hex;
    setColor(hex);
  }

  function handleClear() {
    const canvas = canvasRef.current;
    if (!canvas || strokes.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.beginPath();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    setStrokes(() => []);
  }

  function handleShowColorPicker() {
    setShowColorPicker((visible) => !visible);
  }

  function handleUndo() {
    if (isDrawing.current) return;

    setStrokes((prev) => {
      if (prev.length === 0) return prev;

      const lastStroke = prev[prev.length - 1];

      redoStack.current.push(lastStroke);

      return prev.slice(0, -1);
    });
  }

  function handleRedo() {
    if (isDrawing.current) return;

    setStrokes((prev) => {
      const stroke = redoStack.current.pop();

      if (!stroke) return prev;

      return [...prev, stroke];
    });
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
  }, [size, strokes]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 flex items-center justify-center bg-black"
    >
      <Toolbar
        selectedTool={type}
        onSelectTool={setType}
        onClear={handleClear}
        color={color}
        onChangeColor={handleChangeColor}
        showColorPicker={showColorPicker}
        onShowColorPicker={handleShowColorPicker}
        width={width}
        onWidthChange={setWidth}
        onUndo={handleUndo}
        onRedo={handleRedo}
      />
      <canvas
        ref={canvasRef}
        className="select-none object-contain h-full w-full max-w-full max-h-full bg-white touch-none"
        onPointerDown={handleMouseDown}
        onPointerMove={handleMouseMove}
        onPointerUp={handleMouseUp}
      />
    </div>
  );
}

export default Board;
