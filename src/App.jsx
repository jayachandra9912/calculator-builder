import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const Button = ({ item, onClick, index, moveButton, isFixed }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "button",
    item: { index, value: item },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [index, item]);

  const [, drop] = useDrop(() => ({
    accept: "button",
    hover: (draggedItem) => {
      if (!isFixed && draggedItem.index !== index) {
        moveButton(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  }));

  return (
    <button
      ref={(node) => !isFixed && drag(drop(node))}
      className={`w-full h-16 rounded-lg text-xl flex items-center justify-center hover:bg-opacity-80 ${isDragging ? "opacity-50" : ""}`}
      onClick={() => onClick(item)}
    >
      {item}
    </button>
  );
};

const InputField = ({ input, result, setInput, calculateResult }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "button",
    drop: (item) => {
      if (item.value === "=") {
        calculateResult();
      } else {
        setInput((prev) => prev + item.value);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`text-right border border-black text-2xl p-4 rounded-lg mb-4 ${isOver ? "bg-opacity-70" : ""}`}
    >
      <div>{input || "0"}</div>
    </div>
  );
};

const Calculator = () => {
  const [input, setInput] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [buttons, setButtons] = useState([
    "7", "8", "9", "/",
    "4", "5", "6", "*",
    "1", "2", "3", "-",
    "0", ".", "=", "+"
  ]);

  const handleClick = (value) => {
    if (value === "=") {
      calculateResult();
    } else {
      setInput((prev) => prev + value);
    }
  };

  const clearInput = () => {
    setInput("");
  };

  const calculateResult = () => {
    try {
      if (input.trim() !== "") {
        const calculated = eval(input).toString();
        setInput(calculated);
      }
    } catch (error) {
      setInput("Error");
    }
  };

  const moveButton = (fromIndex, toIndex) => {
    const updatedButtons = [...buttons];
    const [movedButton] = updatedButtons.splice(fromIndex, 1);
    updatedButtons.splice(toIndex, 0, movedButton);
    setButtons(updatedButtons);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={`w-80 mx-auto mt-10 p-4 rounded-lg shadow-lg ${darkMode ? "bg-gray-800 text-white" : "bg-amber-200 text-black"}`}>
        <button
          className="mb-4 p-2 rounded-lg border"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
        <InputField input={input} setInput={setInput} calculateResult={calculateResult} />
        <div className="grid grid-cols-4 gap-3">
          {buttons.map((item, index) => (
            <Button key={index} item={item} index={index} onClick={handleClick} moveButton={moveButton} isFixed={item === "="} />
          ))}
          <button
            className="col-span-4 w-full h-16 bg-red-600 rounded-lg text-xl flex items-center justify-center hover:bg-red-500"
            onClick={clearInput}
          >
            Clear
          </button>
        </div>
      </div>
    </DndProvider>
  );
};

export default Calculator;
