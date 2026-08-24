import { useState } from "react";
import { SketchPicker, type ColorResult } from "react-color";
import { FaRegTrashCan } from "react-icons/fa6";
import { IoIosColorPalette } from "react-icons/io";
import { RiPencilFill } from "react-icons/ri";

interface ToolbarProps {
  onClear?(): void;
  color?: string;
  onChangeColor?(result: ColorResult): void;
  showColorPicker?: boolean;
  onShowColorPicker?(): void;
}

function Toolbar({
  onClear = () => {},
  color = "#000000",
  onChangeColor = () => {},
  showColorPicker = false,
  onShowColorPicker = () => {},
}: ToolbarProps) {
  return (
    <div className="select-none absolute gap-1 top-1/2 -translate-y-5 left-3 z-10 flex flex-col border border-black/8 p-2 bg-white rounded-lg overflow-visible items-center justify-center">
      <button type="button" className="bg-indigo-100 p-1 rounded-md">
        <RiPencilFill className="shrink-0 w-6 h-6 text-blue-950" />
      </button>

      <button
        type="button"
        className="cursor-pointer hover:bg-indigo-100 active:bg-indigo-100 p-1 rounded-md"
        onClick={onShowColorPicker}
      >
        <IoIosColorPalette className="shrink-0 w-6 h-6 text-blue-950" />
      </button>

      {showColorPicker && (
        <SketchPicker
          className="absolute left-full top-0 z-20 text-md ml-2"
          color={color}
          onChange={onChangeColor}
        />
      )}

      <button
        type="button"
        className="cursor-pointer hover:bg-red-100 active:bg-red-100 p-1 rounded-md"
        onClick={onClear}
      >
        <FaRegTrashCan className="shrink-0 w-6 h-6 text-blue-950 hover:text-red-950 active:text-red-950" />
      </button>
    </div>
  );
}

export default Toolbar;
