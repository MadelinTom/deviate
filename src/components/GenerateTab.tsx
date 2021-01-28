import { useState } from "react";

export const GenerateTab = ({onClick}: any) => {
  const [input, setInput] = useState(5000);

  return (
    <div
      id={"contentDiv"}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        id={"form"}
        style={{
          background: "rgba(160, 158, 151, 0.8)",
          zIndex: 1,
          display: "flex",
          flexDirection: "row",
          borderRadius: "10px",
          alignItems: "center",
          margin: "50px",
        }}
      >
        <form style={{ zIndex: 2, margin: "10px", minWidth: "70px" }}>
          <label>Distance in km:</label>
          <br />
          <input
            type="number"
            id="distance"
            name="distance"
            onChange={(event) => setInput(parseInt(event.target.value))}
          />
        </form>

        <button
          style={{
            margin: "10px",
            minWidth: "150px",
            height: "50px",
            zIndex: 2,
          }}
          onClick={() => onClick(input)}
        >
          Generate
        </button>
      </div>
    </div>
  );
};
