import { describe, expect, beforeEach, it, afterEach } from 'vitest'
import Tooltip from "./Tooltip";

describe("Tooltip", () => {
  let tooltip: Tooltip;

  const text = "Hello!";
  const anchorX = 500;
  const anchorY = 1000;

  beforeEach(() => {
    tooltip = new Tooltip();
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("should inject a hidden div into the body when created", () => {
    const tooltipEl = document.querySelector("body > div") as HTMLDivElement;

    expect(tooltipEl.style.getPropertyValue("opacity")).toEqual("0");

    expect(tooltipEl).toMatchSnapshot();
  });

  it("should make tooltip visible with specified text, on top of a certain anchor point, after calling .show()", () => {
    tooltip.show(text, anchorX, anchorY);

    const tooltipEl = document.querySelector("body > div") as HTMLDivElement;

    expect(tooltipEl.style.getPropertyValue("opacity")).toEqual("1");

    //horizontally centered on the anchorX
    const expectedLeft = anchorX - tooltipEl.offsetWidth / 2 + "px";
    expect(tooltipEl.style.getPropertyValue("left")).toEqual(expectedLeft);

    //vertically above the anchorY (with some margin)
    const expectedTop = anchorY - tooltipEl.offsetHeight - 10 + "px";
    expect(tooltipEl.style.getPropertyValue("top")).toEqual(expectedTop);

    const tooltipSpanEl = tooltipEl.querySelector("span");
    expect(tooltipSpanEl?.textContent).toBe(text);
  });

  it("should hide the tooltip, after calling .show() and then .hide()", () => {
    tooltip.show(text, anchorX, anchorY);
    tooltip.hide();

    const tooltipEl = document.querySelector("body > div") as HTMLDivElement;
    expect(tooltipEl.style.getPropertyValue("opacity")).toEqual("0");
  });

  it("should remove the tooltip, after calling .destroy()", () => {
    tooltip.destroy();

    const tooltipEl = document.querySelector("body > div");
    expect(tooltipEl).toBeNull();
  });
});
