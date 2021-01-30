import { render } from "@testing-library/react";
import { RunDistance } from "../types/Map";
import { DistanceTab } from "./DistanceTab";

describe("the DistanceTab component", () => {
  const distance: RunDistance = {
    text: "test",
    value: 10,
  };

  it("should match the snapshot", () => {
    const container = render(<DistanceTab distance={distance} />);

    expect(container).toMatchSnapshot();
  });
});
