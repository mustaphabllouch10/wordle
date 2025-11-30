import { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [pressedkey, setpressedkey] = useState([]);
  const [validate, setvalidate] = useState(false);
  const [currentRow, setcurrentRow] = useState([]);
  const [iswinner, setiswinner] = useState(false);
  const [wordle, setwordle] = useState("");

  useEffect(() => {
    fetch("https://random-word-api.vercel.app/api?words=200&length=5")
      .then((response) => response.json())
      .then((data) => {
        setwordle(data[0].toUpperCase());
        console.log("New Wordle word:", data[0].toUpperCase());
      })
      .catch((error) => console.error("Error fetching:", error));
  }, []);

  useEffect(() => {
    if (iswinner) return;

    function handleKey(e) {
      if (e.key === "Backspace" && currentRow.length > 0) {
        setpressedkey((p) => p.slice(0, -1));
        setcurrentRow((r) => r.slice(0, -1));
        return;
      }

      if (/^[a-zA-Z]$/.test(e.key) && pressedkey.length < 25 && currentRow.length < 5) {
        setpressedkey((p) => [...p, e.key.toUpperCase()]);
        setcurrentRow((r) => [...r, e.key.toUpperCase()]);
      }

      if (e.key === "Enter" && currentRow.length === 5) {
        setvalidate(true);

        const guess = currentRow.join("");
        setcurrentRow([]);

        if (guess === wordle) {
          setiswinner(true);
          alert("Congratulations! You've guessed the word!");
          return;
        }

        if (pressedkey.length >= 25) {
          alert(`Game Over! The correct word was: ${wordle}`);
          return;
        }
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [pressedkey, currentRow, iswinner, wordle]);

  const rows = [];
  for (let i = 0; i < 5; i++) {
    rows.push(pressedkey.slice(i * 5, i * 5 + 5));
  }

  return (
    <div className="app">
      {rows.map((keys, index) => (
        <Row
          key={index}
          pressedkeys={keys}
          validate={validate}
          setvalidate={setvalidate}
          wordle={wordle}
        />
      ))}
    </div>
  );
}

function Row({ pressedkeys, validate, setvalidate, wordle }) {
  const block = Array(5).fill(null).map((_, i) => pressedkeys[i] || null);
  const worde = block.join("");

  return (
    <div className="row" style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
      {block.map((key, i) => (
        <Block
          key={i}
          index={i}
          letter={key}
          worde={worde}
          validate={validate}
          setvalidate={setvalidate}
          wordle={wordle}
        />
      ))}
    </div>
  );
}

function Block({ index, letter, worde, validate, setvalidate, wordle }) {
  const [color, setColor] = useState("#f9f9f9");

  useEffect(() => {
    if (!validate) return;

    if (!letter) {
      setColor("#f9f9f9");
      return;
    }

    if (worde.length === 5) {
      if (letter === wordle[index]) {
        setColor("#6aaa64"); // correct
      } else if (wordle.includes(letter)) {
        setColor("#c9b458"); // wrong spot
      } else {
        setColor("#787c7e"); // not in word
      }
    }

    setvalidate(false);
  }, [validate, letter, index, worde, wordle, setvalidate]);

  return (
    <div
      className="block"
      style={{
        width: "40px",
        height: "40px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: "1px solid #ccc",
        backgroundColor: color,
        fontSize: "20px",
      }}
    >
      {letter}
    </div>
  );
}