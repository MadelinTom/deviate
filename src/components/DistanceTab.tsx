export const DistanceTab = ({distance}: any) => {
  const {text, value} = distance;
  const kilometers = (value / 1000).toFixed(1);

  return (
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
        margin: "30px",
      }}
    >
      <p style={{ margin: "10px", alignSelf: "center" }}>
        {`${text} | ${kilometers} km`}
      </p>
    </div>
  );
};
