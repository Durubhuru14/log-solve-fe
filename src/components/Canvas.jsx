import { Stage, Layer, Line } from "react-konva";
import { useRef, useState } from "react";
import axios from "axios";
import { calculate } from "../utils/calculate";

const Canvas = ({
  tool,
  strokeWidth,
  onHistoryUpdate,
  lines,
  setLines,
  strokeColor,
  finalHtml,
}) => {
  const isDrawing = useRef(false);
  const stageRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    const newLine = {
      tool,
      points: [pos.x, pos.y],
      stroke: strokeColor,
      tension: 0.7,
      strokeWidth,
    };
    const updated = [...lines, newLine];
    setLines(updated);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current) return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    const lastLine = lines[lines.length - 1];
    if (!lastLine) return;

    const newLine = {
      ...lastLine,
      points: [...lastLine.points, point.x, point.y],
    };

    const updated = [...lines.slice(0, -1), newLine];
    setLines(updated);
  };

  const handleMouseUp = () => {
    if (isDrawing.current) {
      onHistoryUpdate(lines);
    }
    isDrawing.current = false;
  };

  const submitToServer = async () => {
    setIsLoading(true);
    const uri = stageRef.current.toDataURL({ pixelRatio: 2 });
    const blob = await (await fetch(uri)).blob();
    const formData = new FormData();
    formData.append("image", blob, "drawing.png");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}api/calc-from-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const [mul, div] = response.data.result
        .split("/")
        .map((part) => part.trim());
      const htmlResult = calculate(mul, div);

      setLines([]);
      onHistoryUpdate([], htmlResult);
    } catch (err) {
      console.error("❌ Upload failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Stage
        ref={stageRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
      >
        <Layer>
          {lines.map((line, idx) => (
            <Line
              key={idx}
              points={line.points}
              stroke={line.tool === "eraser" ? "white" : line.stroke}
              strokeWidth={line.strokeWidth}
              globalCompositeOperation={
                line.tool === "eraser" ? "destination-out" : "source-over"
              }
              tension={0.5}
              lineCap="round"
              lineJoin="round"
            />
          ))}
        </Layer>
      </Stage>

      {finalHtml && (
        <div
          className="absolute top-1/2 left-1/2 -translate-1/2 text-gray-100 text-sm sm:text-lg font-['Gochi_Hand',cursive]"
          dangerouslySetInnerHTML={{ __html: finalHtml }}
        />
      )}

      <button
        onClick={submitToServer}
        disabled={isLoading}
        className="fixed cursor-pointer capitalize w-28 h-10 text-center left-1/2 top-18 -translate-x-1/2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 sm:left-[initial] sm:right-3 sm:-translate-x-0 sm:top-4 rounded disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? (
          <div className="flex gap-1 items-center justify-center">
            <span className="sr-only">Loading...</span>
            <div className="bouncing-balls [animation-delay:-0.3s]"></div>
            <div className="bouncing-balls [animation-delay:-0.15s]"></div>
            <div className="bouncing-balls"></div>
          </div>
        ) : (
          "Calculate"
        )}
      </button>
    </>
  );
};

export default Canvas;
