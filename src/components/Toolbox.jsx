import { FaEraser, FaPen, FaRedo, FaTrash, FaUndo } from "react-icons/fa";
import { BiReset } from "react-icons/bi";
import { IoColorPalette } from "react-icons/io5";
import { colorSwatches } from "../utils/constants";
import { useState } from "react";

const Toolbar = ({
  tool,
  setTool,
  strokeWidth,
  setStrokeWidth,
  strokeColor,
  setStrokeColor,
  handleUndo,
  handleRedo,
  handleClear,
  handleReset,
  canUndo,
  canRedo,
}) => {
  const [isToolBoxOpen, setIsToolBoxOpen] = useState(false);
  return (
    <>
      {/* Top quick actions */}
      <div className="fixed top-3 left-1/2 -translate-x-1/2 bg-gray-800 text-white flex gap-2 items-center p-2 rounded-2xl z-50 shadow">
        <button
          onClick={handleUndo}
          disabled={!canUndo}
          title="Undo"
          className="quick-actions"
        >
          <FaUndo />
        </button>
        <button
          onClick={handleRedo}
          disabled={!canRedo}
          title="Redo"
          className="quick-actions"
        >
          <FaRedo />
        </button>
        <button onClick={handleClear} title="Clear" className="quick-actions">
          <FaTrash />
        </button>
        <button onClick={handleReset} title="Reset" className="quick-actions">
          <BiReset />
        </button>
      </div>

      {/* Bottom toolbox band */}
      <div
        className={`${
          isToolBoxOpen ? "visible" : "invisible translate-y-1/2 opacity-0"
        } fixed top-1/2 left-1/2 w-64 h-46 lg:w-fit lg:h-fit -translate-1/2 opacity-100 lg:top-[initial] lg:bottom-5 lg:-translate-y-0 lg:-translate-x-1/2 rounded-lg bg-gray-900 text-white p-4 flex flex-col items-center justify-center lg:visible lg:flex-row lg:justify-between gap-4 z-40 shadow-inner transition-all`}
      >
        {/* Tool buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => setTool("pen")}
            disabled={tool === "pen"}
            className={`toolbox-btn ${tool === "pen" ? "bg-gray-700" : ""}`}
            title="Pen"
          >
            <FaPen />
          </button>
          <button
            onClick={() => setTool("eraser")}
            disabled={tool === "eraser"}
            className={`toolbox-btn ${tool === "eraser" ? "bg-gray-700" : ""}`}
            title="Eraser"
          >
            <FaEraser />
          </button>
        </div>

        {/* Stroke width slider */}
        <label className="text-sm flex items-center gap-2">
          Size:
          <input
            type="range"
            min={1}
            max={30}
            value={strokeWidth}
            className="cursor-e-resize"
            onChange={(e) => setStrokeWidth(Number(e.target.value))}
          />
          <span>{strokeWidth < 10 ? `0${strokeWidth}` : strokeWidth}px</span>
        </label>

        {/* Color swatch */}
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 text-sm">
          {colorSwatches.map((color) => (
            <button
              key={color}
              className={`size-6 rounded-full border-2 transition-colors cursor-pointer border-gray-700 hover:border-white ${
                strokeColor === color ? "border-white" : ""
              }`}
              style={{ backgroundColor: color }}
              onClick={() => setStrokeColor(color)}
            />
          ))}
        </div>
      </div>
      {/* Toggle options for smaller screens */}
      <button
        type="button"
        className="text-gray-100 fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-gray-800 p-2 rounded-2xl hover:bg-gray-900 cursor-pointer lg:invisible"
        onClick={() => setIsToolBoxOpen(!isToolBoxOpen)}
        title="Toggle Toolbox"
      >
        <IoColorPalette className="size-8" />
      </button>
    </>
  );
};

export default Toolbar;
