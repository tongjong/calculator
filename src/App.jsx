import { useReducer } from "react";
import "./App.css";
import { DigitButton, OperationButton } from "./Button";
import { ACTIONS } from "./ACTIONS";

const btnClickColor = document.querySelectorAll("button");

btnClickColor.forEach((button) => {
  button.addEventListener("click", function () {
    button.classList.add("clicked");

    setTimeout(function () {
      button.classList.remove("clicked");
    }, 100);
  });
});

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          curOperand: payload.digit,
          overwrite: false,
        };
      }

      if (payload.digit === "0" && state.curOperand === "0") {
        return state;
      }

      if (payload.digit === "." && state.curOperand.includes(".")) {
        return state;
      }
      return {
        ...state,
        curOperand: `${state.curOperand || ""}${payload.digit}`,
      };

    case ACTIONS.CHOOSE_OPERATION:
      if (state.curOperand == "" && state.preOperand == "") {
        return state;
      }
      if (state.curOperand == "") {
        return {
          ...state,
          operation: payload.operation,
        };
      }
      if (state.preOperand == "") {
        return {
          ...state,
          curOperand: "",
          preOperand: state.curOperand,
          operation: payload.operation,
        };
      }

      return {
        ...state,
        preOperand: equals(state),
        curOperand: "",
        operation: payload.operation,
      };

    case ACTIONS.EQUALS:
      if (
        state.operation == "" ||
        state.preOperand == "" ||
        state.curOperand == ""
      ) {
        return state;
      }

      return {
        ...state,
        overwrite: true,
        preOperand: "",
        operation: "",
        curOperand: equals(state),
      };

    case ACTIONS.CLEAR:
      return { operation: "", preOperand: "", curOperand: "" };
  }
}

function equals({ operation, preOperand, curOperand }) {
  const prev = parseFloat(preOperand);
  const current = parseFloat(curOperand);

  if (isNaN(prev) || isNaN(current)) return "";
  let result = "";
  switch (operation) {
    case "+":
      result = prev + current;
      break;
    case "-":
      result = prev - current;
      break;
    case "x":
      result = prev * current;
      break;
    case "÷":
      result = prev / current;
      break;
  }
  return result.toString();
}

const formatter = new Intl.NumberFormat({ maximumFractionDigits: 0 });

function formatInt(operand) {
  if (operand === "") return;
  const [interger, decimal] = operand.split(".");
  if (decimal === undefined) {
    return formatter.format(interger);
  }
  return `${formatter.format(interger)}.${decimal}`;
}

function App() {
  const [{ operation, preOperand, curOperand }, dispatch] = useReducer(
    reducer,
    { operation: "", preOperand: "", curOperand: "" }
  );
  return (
    <div className="app">
      <div id="display">
        <div className="pre-operand">
          {formatInt(preOperand)}
          {operation}
        </div>
        <div className="cur-operand">{formatInt(curOperand)}</div>
      </div>

      <button
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
        id="clear"
        className="span-2"
      >
        AC
      </button>
      <OperationButton dispatch={dispatch} operation="÷" id="divide" />
      <OperationButton dispatch={dispatch} operation="x" id="multiply" />

      <DigitButton dispatch={dispatch} digit="7" id="seven" />
      <DigitButton dispatch={dispatch} digit="8" id="eight" />
      <DigitButton dispatch={dispatch} digit="9" id="nine" />
      <OperationButton dispatch={dispatch} operation="-" id="subtract" />

      <DigitButton dispatch={dispatch} digit="4" id="four" />
      <DigitButton dispatch={dispatch} digit="5" id="five" />
      <DigitButton dispatch={dispatch} digit="6" id="six" />
      <OperationButton dispatch={dispatch} operation="+" id="add" />

      <DigitButton dispatch={dispatch} digit="1" id="one" />
      <DigitButton dispatch={dispatch} digit="2" id="two" />
      <DigitButton dispatch={dispatch} digit="3" id="three" />
      <button
        onClick={() => dispatch({ type: ACTIONS.EQUALS })}
        id="equals"
        className="row-span-2"
      >
        =
      </button>

      <DigitButton dispatch={dispatch} digit="0" id="zero" />
      <DigitButton dispatch={dispatch} digit="." id="decimal" />
    </div>
  );
}

export default App;
