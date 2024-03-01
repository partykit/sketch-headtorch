export default function Frame(props: { children?: React.ReactNode }) {
  const SIDE = 48; // in rem

  return (
    <div style={{ display: "flex", justifyItems: "center" }}>
      <div
        style={{
          position: "relative",
          background: "#c0c0c0",
          borderColor: "#606060",
          display: "flex",
          flexDirection: "column",
          justifyItems: "space-between",
          overflow: "clip",
          cursor: "move",
          height: `${SIDE}rem`,
          width: `${SIDE}rem`,
          borderRadius: `0.25rem`,
          borderWidth: `0.25rem`,
        }}
      >
        {props.children}
      </div>
    </div>
  );
}
