import { useState } from "react";
import Canvas from "./components/Canvas";
import Toolbox from "./components/Toolbox";

const App = () => {
  const [tool, setTool] = useState("pen");
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [strokeColor, setStrokeColor] = useState("#FFFFFF");
  const [lines, setLines] = useState([]);
  const [history, setHistory] = useState([{ lines: [], html: "" }]);
  const [step, setStep] = useState(0);
  const [finalHtml, setFinalHtml] = useState("");

  const updateHistory = (newLines, newHtml = "") => {
    const updated = [
      ...history.slice(0, step + 1),
      { lines: newLines, html: newHtml },
    ];
    setHistory(updated);
    setStep(updated.length - 1);
    setLines(newLines);
    setFinalHtml(newHtml);
  };

  const handleUndo = () => {
    if (step > 0) {
      const { lines, html } = history[step - 1];
      setStep(step - 1);
      setLines(lines);
      setFinalHtml(html);
    }
  };

  const handleRedo = () => {
    if (step < history.length - 1) {
      const { lines, html } = history[step + 1];
      setStep(step + 1);
      setLines(lines);
      setFinalHtml(html);
    }
  };

  const handleClear = () => {
    updateHistory([]);
  };

  const handleReset = () => {
    const init = { lines: [], html: "" };
    setLines([]);
    setHistory([init]);
    setStep(0);
    setTool("pen");
    setStrokeWidth(4);
    setFinalHtml("");
  };

  return (
    <>
      <Toolbox
        tool={tool}
        setTool={setTool}
        strokeWidth={strokeWidth}
        setStrokeWidth={setStrokeWidth}
        strokeColor={strokeColor}
        setStrokeColor={setStrokeColor}
        handleUndo={handleUndo}
        handleRedo={handleRedo}
        handleClear={handleClear}
        handleReset={handleReset}
        canUndo={step > 0}
        canRedo={step < history.length - 1}
      />
      <Canvas
        tool={tool}
        strokeWidth={strokeWidth}
        strokeColor={strokeColor}
        onHistoryUpdate={updateHistory}
        lines={lines}
        setLines={setLines}
        finalHtml={finalHtml}
        setFinalHtml={setFinalHtml}
      />
    </>
  );
};

export default App;
