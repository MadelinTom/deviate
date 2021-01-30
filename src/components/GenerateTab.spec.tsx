import { render } from "@testing-library/react";
import { GenerateTab } from "./GenerateTab"

describe("The GenerateTab component", () => {
  it("should match the snapshot", () => {
    const component = render(<GenerateTab onClick={() => {}}/>);

    expect(component).toMatchSnapshot();
  })
})