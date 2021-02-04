import { RunDistance } from "../types/Map";

export interface DistanceTabProps {
  distance: RunDistance;
}

export const DistanceTab = ({ distance }: DistanceTabProps) => {
  const { text, value } = distance;
  const kilometers = (value / 1000).toFixed(1);

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          background: "red", // temp
          zIndex: 2, // temp
        }}
      >
        {/* MENU BURGER */}
        <div
          style={{
            background: "rgba(160, 158, 151, 0.8)",
            zIndex: 2,
          }}
        >
          TEST TEXT
        </div>

        {/* Distance container */}
        <div style={{ display: "flex", justifyContent: "flex-start", background: "blue" }}>
          <div
            id={"distance"}
            style={{ 
              background: "rgba(160, 158, 151, 0.8)",
              zIndex: 1,
              display: "flex",
              borderRadius: "10px",
              alignItems: "center",
              alignSelf: "center",
              height: "50px",
              margin: "30px"
            }}
          >
            <p style={{ margin: "10px", alignSelf: "center" }}>
              {`${text} | ${kilometers} km`}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
