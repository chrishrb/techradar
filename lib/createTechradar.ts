import { select } from "d3";

import generateTechradarVizData from "./generateTechradarVizData";

import Tooltip from "./Tooltip";

import type {
  TechradarData,
  TechradarOptions,
  TechradarVizData,
} from "./types";

const createTechradar = (
  targetEl: any,
  data: TechradarData,
  options?: TechradarOptions
): {
  vizData: TechradarVizData,
  destroy: () => void,
} => {
  const { blipTooltipEnabled = true, ...vizOptions } = (options || {});

  //generate areas and blips
  const vizData = generateTechradarVizData(data, vizOptions);

  const size = vizData.global.radarSize + 400;
  const radarRadius = size / 2;

  //setup base svg
  const techradar = select(targetEl)
    .append("svg")
    .style("-webkit-user-select", "none")
    .style("-moz-user-select", "none")
    .style("-ms-user-select", "none")
    .style("user-select", "none")
    .attr("width", size)
    .attr("height", size);


  //add centered container
  const container = techradar
    .append("g")
    .attr("transform", `translate(${radarRadius}, ${radarRadius})`);

  //add areas
  container
    .selectAll("path")
    .data(vizData.areas)
    .enter()
    .append("path")
    // .attr("fill", area => vizData.rings[area.ringIndex].color)
    .attr("fill", "transparent")
    .attr("stroke", "gray")
    .attr("stroke-width", "0.5")
    .attr("d", area => area.path);

  container
    .selectAll("g")
    .data(vizData.rings)
    .enter()
    .append("text")
    .attr("y", rings => rings.y)
    .attr("dy", 70)
    .attr("text-anchor", "middle")
    .attr("opacity", 0.35)
    .attr("font-family", "Arial, Helvetica")
    .attr("font-size", "42px")
    .attr("font-weight", "bold")
    .attr("pointer-events", "none")
    .attr("user-select", "none")
    .attr("fill", rings => rings.color)
    .text(rings => rings.name)

  techradar
    .append("g")
    .attr("transform", `translate(${radarRadius}, ${radarRadius})`)
    .selectAll("path")
    .data(vizData.slices)
    .enter()
    .append("text")
    .attr("fill", "white")
    .attr("text-anchor", slice => slice.textAnchor)
    .attr("x", slice => slice.x)
    .attr("y", slice => slice.y)
    .text(slice => slice.name);
    

  //add blips
  const blips = container
    .selectAll("g")
    .data(vizData.blips)
    .enter()
    .append("g")
    .style("font-size", "12")
    .attr("transform", blip => `translate(${blip.x}, ${blip.y})`);

  blips
    .append("circle")
    .attr("r", vizData.global.blipRadius)
    .attr("stroke", "black")
    .attr("fill", blip => vizData.rings[blip.ringIndex].color);

  blips
    .append("text")
    .style("pointer-events", "none")
    .attr("dy", 4)
    .attr("text-anchor", "middle")
    .attr("fill", blip => vizData.rings[blip.ringIndex].textColor)
    .text((_, blipIndex) => blipIndex + 1);

  let tooltip: Tooltip;

  if (blipTooltipEnabled) {
    tooltip = new Tooltip();

    blips
      .on("mouseover", (_, blip) => {
        const blipRect = (event?.target as HTMLInputElement).getBoundingClientRect();

        tooltip.show(blip.name, blipRect.x + blipRect.width / 2, blipRect.y);
      })
      .on("mouseout", () => {
        tooltip.hide();
      });
  }

  let isDestroyed = false;

  const destroy = () => {
    if (isDestroyed) {
      return;
    }
    isDestroyed = true;
    if (tooltip) tooltip.destroy();
    techradar.remove();
  };

  return {
    vizData,
    destroy,
  };
};

export default createTechradar;
