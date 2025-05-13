import { useRive } from "@rive-app/react-canvas";

const MyAnimation = () => {
  const { rive, RiveComponent } = useRive({
    src: "/untitled.riv",
    autoplay: true,
    stateMachines: ["State Machine 1"],
  });

  return (
    <div style={{ width: 300, height: 300 }} className="mx-auto">
      {RiveComponent ? <RiveComponent /> : <p>Loading...</p>}
    </div>
  );
};

export default MyAnimation;
