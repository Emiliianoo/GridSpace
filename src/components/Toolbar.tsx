import { useState } from "react";
import { SketchPicker, type ColorResult } from "react-color";
import { BsBorderWidth } from "react-icons/bs";
import { FaRedo, FaUndo } from "react-icons/fa";
import { FaEraser, FaRegTrashCan } from "react-icons/fa6";
import { IoIosColorPalette } from "react-icons/io";
import { RiPencilFill } from "react-icons/ri";

export type Tool = "pen" | "eraser";

interface ToolbarProps {
  selectedTool?: Tool;
  onClear?(): void;
  color?: string;
  onChangeColor?(result: ColorResult): void;
  showColorPicker?: boolean;
  onShowColorPicker?(): void;
  onSelectTool?(tool: Tool): void;
  width?: number;
  onWidthChange?(width: number): void;
  onUndo?(): void;
  onRedo?(): void;
}

function Toolbar({
  selectedTool = "pen",
  onClear = () => {},
  color = "#000000",
  onChangeColor = () => {},
  showColorPicker = false,
  onShowColorPicker = () => {},
  onSelectTool = () => {},
  width = 1,
  onWidthChange = () => {},
  onUndo = () => {},
  onRedo = () => {},
}: ToolbarProps) {
  const [isWidthContainerOpen, setIsWidthContainerOpen] =
    useState<boolean>(false);

  const iconButtonClass =
    "w-8 h-8 flex items-center justify-center p-1 rounded-md cursor-pointer";

  function handleWidthChange(nextWidth: number) {
    onWidthChange(Math.min(20, Math.max(1, nextWidth)));
  }

  return (
    <div className="select-none absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex max-w-[calc(100vw-1.5rem)] flex-row flex-wrap gap-1 border border-black/8 p-1 bg-white rounded-lg overflow-visible items-center justify-center sm:top-1/2 sm:bottom-auto sm:left-3 sm:translate-x-0 sm:-translate-y-1/2 sm:max-w-none sm:flex-nowrap sm:flex-col">
      <div className="flex flex-row gap-1 border-r-2 border-black/10 p-2 mr-2 sm:flex-col sm:border-r-0 sm:border-b-2 sm:mr-0 sm:mb-2">
        <button
          type="button"
          className={`${iconButtonClass} hover:bg-indigo-100 active:bg-indigo-100`}
          onClick={onUndo}
        >
          <FaUndo className="shrink-0 w-5 h-5 text-black/20 hover:text-blue-950 active:text-blue-950" />
        </button>

        <button
          type="button"
          className={`${iconButtonClass} hover:bg-indigo-100 active:bg-indigo-100`}
          onClick={onRedo}
        >
          <FaRedo className="shrink-0 w-5 h-5 text-black/20 hover:text-blue-950 active:text-blue-950" />
        </button>
      </div>

      <button
        type="button"
        onClick={() => onSelectTool("pen")}
        className={`${iconButtonClass} ${selectedTool === "pen" ? "bg-indigo-100" : "bg-transparent"} hover:bg-indigo-100 active:bg-indigo-100`}
      >
        <RiPencilFill className="shrink-0 w-5 h-5 text-blue-950" />
      </button>

      <button
        type="button"
        onClick={() => onSelectTool("eraser")}
        className={`${iconButtonClass} ${selectedTool === "eraser" ? "bg-indigo-100" : "bg-transparent"} hover:bg-indigo-100 active:bg-indigo-100`}
      >
        <FaEraser className="shrink-0 w-5 h-5 text-blue-950" />
      </button>

      {/* Color picker */}
      <button
        type="button"
        className={`${iconButtonClass} hover:bg-indigo-100 active:bg-indigo-100`}
        onClick={() => {
          if (isWidthContainerOpen) setIsWidthContainerOpen(false);

          onShowColorPicker();
        }}
      >
        <IoIosColorPalette className="shrink-0 w-5 h-5 text-blue-950" />
      </button>

      {showColorPicker && (
        <SketchPicker
          className="absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 text-md sm:bottom-auto sm:left-full sm:top-0 sm:ml-2 sm:translate-x-0"
          color={color}
          onChange={onChangeColor}
        />
      )}

      {/* Width selector */}
      <button
        type="button"
        className={`${iconButtonClass} hover:bg-indigo-100 active:bg-indigo-100`}
        onClick={() => {
          if (showColorPicker) onShowColorPicker();

          setIsWidthContainerOpen((prev) => !prev);
        }}
      >
        <BsBorderWidth className="shrink-0 w-5 h-5 text-blue-950" />
      </button>

      {isWidthContainerOpen && (
        <div className="absolute flex gap-1 bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 text-md sm:left-full sm:bottom-8 sm:ml-2 sm:translate-x-0 border border-black/8 p-1 bg-white rounded-lg">
          <input
            type="range"
            min={1}
            max={20}
            value={width}
            onChange={(e) => handleWidthChange(Number(e.target.value))}
          />
          <input
            type="number"
            className="max-w-10"
            min={1}
            max={20}
            value={width}
            onChange={(e) => handleWidthChange(Number(e.target.value))}
          />
        </div>
      )}

      <button
        type="button"
        className={`${iconButtonClass} hover:bg-red-100 active:bg-red-100`}
        onClick={onClear}
      >
        <FaRegTrashCan className="shrink-0 w-5 h-5 text-blue-950 hover:text-red-950 active:text-red-950" />
      </button>
    </div>
  );
}

export default Toolbar;
