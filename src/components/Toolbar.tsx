import { SketchPicker, type ColorResult } from "react-color";
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
  onUndo = () => {},
  onRedo = () => {},
}: ToolbarProps) {
  const iconButtonClass =
    "w-8 h-8 flex items-center justify-center p-1 rounded-md cursor-pointer";

  return (
    <div className="select-none absolute gap-1 top-1/2 -translate-y-5 left-3 z-10 flex flex-col border border-black/8 p-1 bg-white rounded-lg overflow-visible items-center justify-center">
      <div className="flex flex-col gap-1 border-b-2 border-black/10 p-2 mb-2">
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

      <button
        type="button"
        className={`${iconButtonClass} hover:bg-indigo-100 active:bg-indigo-100`}
        onClick={onShowColorPicker}
      >
        <IoIosColorPalette className="shrink-0 w-5 h-5 text-blue-950" />
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
        className={`${iconButtonClass} hover:bg-red-100 active:bg-red-100`}
        onClick={onClear}
      >
        <FaRegTrashCan className="shrink-0 w-5 h-5 text-blue-950 hover:text-red-950 active:text-red-950" />
      </button>
    </div>
  );
}

export default Toolbar;
