import { Stage, Layer, Line } from "react-konva";
import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { calculate } from "../utils/calculate";

const getRelativePointerPosition = (stage) => {
  const transform = stage.getAbsoluteTransform().copy();
  transform.invert();
  const pos = stage.getPointerPosition();
  return transform.point(pos);
};

const Canvas = ({
  tool,
  strokeWidth,
  onHistoryUpdate,
  lines,
  setLines,
  strokeColor,
  finalHtml,
  setFinalHtml,
}) => {
  const isDrawing = useRef(false);
  const stageRef = useRef(null);
  const lastDistRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (window.MathJax) {
      window.MathJax.typeset();
    }
  }, [finalHtml]);

  useEffect(() => {
    const stage = stageRef.current;
    const handleTouchMove = (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];

        const dist = Math.sqrt(
          Math.pow(touch1.clientX - touch2.clientX, 2) +
            Math.pow(touch1.clientY - touch2.clientY, 2)
        );

        if (lastDistRef.current) {
          const scaleBy = dist / lastDistRef.current;
          const pointer = {
            x: (touch1.clientX + touch2.clientX) / 2,
            y: (touch1.clientY + touch2.clientY) / 2,
          };

          const mousePointTo = {
            x: (pointer.x - stagePos.x) / scale,
            y: (pointer.y - stagePos.y) / scale,
          };

          const newScale = scale * scaleBy;
          const newPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
          };

          setScale(newScale);
          setStagePos(newPos);
        }

        lastDistRef.current = dist;
      }
    };

    const handleTouchEnd = () => {
      lastDistRef.current = null;
    };

    const container = stage.container();
    container.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    container.addEventListener("touchend", handleTouchEnd);

    return () => {
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [scale, stagePos]);

  const handleMouseDown = (e) => {
    if (tool === "pan" || e.target.getStage().isDragging()) return;

    isDrawing.current = true;
    const stage = e.target.getStage();
    const pos = getRelativePointerPosition(stage);

    const newLine = {
      tool,
      points: [pos.x, pos.y],
      stroke: strokeColor,
      strokeWidth,
    };
    setLines((prevLines) => [...prevLines, newLine]);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current || tool === "pan") return;

    const stage = e.target.getStage();
    const point = getRelativePointerPosition(stage);
    const lastLine = lines[lines.length - 1];
    if (!lastLine) return;

    const newLine = {
      ...lastLine,
      points: [...lastLine.points, point.x, point.y],
    };

    setLines([...lines.slice(0, -1), newLine]);
  };

  const handleMouseUp = () => {
    if (isDrawing.current && tool !== "pan") {
      onHistoryUpdate(lines);
    }
    isDrawing.current = false;
  };

  const handleDragEnd = (e) => {
    const pos = e.target.position();
    setStagePos(pos);
  };

  const handleWheel = (e) => {
    e.evt.preventDefault();
    const scaleBy = 1.05;
    const stage = stageRef.current;
    const oldScale = scale;

    const pointer = stage.getPointerPosition();
    const mousePointTo = {
      x: (pointer.x - stagePos.x) / oldScale,
      y: (pointer.y - stagePos.y) / oldScale,
    };

    const direction = e.evt.deltaY > 0 ? -1 : 1;
    const newScale = oldScale * (direction > 0 ? scaleBy : 1 / scaleBy);
    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };

    setScale(newScale);
    setStagePos(newPos);
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
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log(response.data.result);
      const [mul, div] = response.data.result
        .split("÷")
        .map((part) => part.trim());
      const htmlResult = calculate(mul, div);
      setFinalHtml(htmlResult);
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
        draggable={tool === "pan"}
        x={stagePos.x}
        y={stagePos.y}
        scaleX={scale}
        scaleY={scale}
        onWheel={handleWheel}
        onDragEnd={handleDragEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
        style={{ background: "#111" }}
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
        <div className="w-full absolute top-1/2 left-1/2 -translate-1/2 text-gray-100 text-lg sm:text-xl pointer-events-none">
          <div
            className="w-fit h-full mx-auto"
            dangerouslySetInnerHTML={{ __html: finalHtml }}
          />
        </div>
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
