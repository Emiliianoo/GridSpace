import { FaRegTrashCan } from "react-icons/fa6";
import { HiOutlinePencil } from "react-icons/hi";

interface ToolbarProps {
  onClear?(): void;
}

function Toolbar({ onClear = () => {} }: ToolbarProps) {
  return (
    <div className="absolute top-1/2 -translate-y-5 left-2 z-10 flex flex-col border-2 bg-white rounded-2xl overflow-hidden items-center justify-center">
      <button type="button" className="bg-blue-200 p-2">
        <HiOutlinePencil className="shrink-0 w-7 h-7 text-blue-800" />
      </button>

      <button type="button" className="cursor-pointer hover:bg-black/8 p-2">
        <FaRegTrashCan className="shrink-0 w-6 h-6" onClick={onClear} />
      </button>
    </div>
  );
}

export default Toolbar;
