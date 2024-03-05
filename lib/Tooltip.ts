import { Selection, select } from "d3";

export default class Tooltip {
  // TODO
  private tooltip: Selection<HTMLDivElement, unknown, HTMLElement, null>;
  private tooltipSpan: Selection<HTMLSpanElement, unknown, HTMLElement, null>;

  constructor() {
    //create tooltip
    this.tooltip = select("body")
      .append("div")
      .style("font-size", "12px")
      .style("color", "white")
      .style("opacity", 0)
      .style("position", "fixed")
      .style("pointer-events", "none")
      .style("border-radius", "3px")
      .style("background-color", "black")
      .style("padding", "5px 8px");

    //add tooltip's text container
    this.tooltipSpan = this.tooltip
      .append("span")
      .style("white-space", "nowrap");

    //add tooltip's box arrow
    this.tooltip
      .append("div")
      .text("▼")
      .style("color", "black")
      .style("position", "absolute")
      .style("margin-top", "-3px")
      .style("top", "100%")
      .style("left", 0)
      .style("width", "100%")
      .style("text-align", "center");
  }

  show = (text: string, anchorX: number, anchorY: number) => {
    this.tooltipSpan.text(text);
    const node = this.tooltip.node();
    this.tooltip
      .style("opacity", 1)
      .style("left", anchorX - (node ? node.offsetWidth : 0) / 2 + "px")
      .style("top", anchorY - (node ? node.offsetHeight : 0) - 10 + "px");
  };

  hide = () => {
    this.tooltip.style("opacity", 0);
    this.tooltipSpan.text("");
  };

  destroy = () => {
    this.tooltip.remove();
  };
}
