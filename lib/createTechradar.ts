import { select, symbol, symbolTriangle } from "d3";

import generateTechradarVizData from "./generateTechradarVizData";

import Tooltip from "./Tooltip";

import {
  type TechradarBlipVizData,
  type TechradarData,
  type TechradarOptions,
  type TechradarSliceVizData,
  type TechradarVizData,
} from "./types";

function highlightLegendItem(blip: TechradarBlipVizData, color: string) {
  const legendItem = document.getElementById("legendItem-" + blip.blipIndex);
  if (!legendItem) return;
  legendItem.setAttribute("fill", color);
}

function unhighlightLegendItem(blip: TechradarBlipVizData, color: string) {
  const legendItem = document.getElementById("legendItem-" + blip.blipIndex);
  if (!legendItem) return;
  legendItem.setAttribute("fill", color);
}

function getXTransform(slice: TechradarSliceVizData, bbox: DOMRect) {
  switch (slice.anchor.x) {
    case "left": return slice.x;
    case "middle": return slice.x - bbox.width / 2;
    case "right": return slice.x - bbox.width;
  }
}

function getYTransform(slice: TechradarSliceVizData, bbox: DOMRect) {
  switch (slice.anchor.y) {
    case "top": return slice.y;
    case "bottom": return slice.y - bbox.height;
  }
}

const createTechradar = (
  targetEl: HTMLElement | null,
  data: TechradarData,
  options?: TechradarOptions
): {
  vizData: TechradarVizData,
  destroy: () => void,
} => {
  const { blipTooltipEnabled = true, ...vizOptions } = (options || {});

  //generate areas and blips
  const vizData = generateTechradarVizData(data, vizOptions);

  //setup base svg
  const svg = select(targetEl);
  svg.selectAll("*").remove()
  const techradar = svg
    .append("svg")
    .style("-webkit-user-select", "none")
    .style("-moz-user-select", "none")
    .style("-ms-user-select", "none")
    .style("user-select", "none")

  //add centered container
  const container = techradar.append("g");
  const radarContainer = container
    .append("g");

  //add areas
  radarContainer
    .selectAll("path")
    .data(vizData.areas)
    .enter()
    .append("path")
    // .attr("fill", area => vizData.rings[area.ringIndex].color)
    .attr("fill", "transparent")
    .attr("stroke", "gray")
    .attr("stroke-width", "0.5")
    .attr("d", area => area.path);

  radarContainer
    .selectAll("g")
    .data(vizData.rings)
    .enter()
    .append("text")
    .attr("y", ring => ring.y)
    .attr("dy", vizData.global.radarSize/12)
    .attr("text-anchor", "middle")
    .attr("opacity", 0.35)
    .attr("font-family", "Arial, Helvetica")
    .attr("font-size", `${vizData.global.radarSize/21}px`)
    .attr("font-weight", "bold")
    .attr("pointer-events", "none")
    .attr("user-select", "none")
    .attr("fill", ring => ring.color)
    .text(ring => ring.name)

  //add blips
  const blips = radarContainer
    .selectAll("g")
    .data(vizData.blips)
    .enter()
    .append("g")
    .attr("id", blip => `blip-${blip.blipIndex}`)
    .style("font-size", "12")
    .attr("transform", blip => `translate(${blip.x}, ${blip.y})`);

  blips
    .filter(blip => blip.state === 'stable' || blip.state === undefined)
    .append("circle")
    .attr("r", vizData.global.blipRadius)
    .attr("fill", blip => vizData.rings[blip.ringIndex].color);

  blips
    .filter(blip => blip.state === 'up')
    .append("path")
    .attr("d", symbol(symbolTriangle).size(vizData.global.blipRadius * 30))
    .attr("fill", blip => vizData.rings[blip.ringIndex].color);

  blips
    .filter(blip => blip.state === 'down')
    .append("path")
    .attr("d", symbol(symbolTriangle).size(vizData.global.blipRadius * 30))
    .attr("fill", blip => vizData.rings[blip.ringIndex].color)
    .attr("transform", "rotate(-180)");

  blips
    .append("text")
    .style("pointer-events", "none")
    .attr("dy", 4)
    .attr("class", (blip) => blip.icon != null ? "nf" : "")
    .attr("font-family", "Arial, Helvetica")
    .attr("font-size", `${vizData.global.blipRadius}px`)
    .attr("pointer-events", "none")
    .attr("user-select", "none")
    .attr("text-anchor", "middle")
    .attr("fill", blip => vizData.rings[blip.ringIndex].textColor)
    .text(blip => blip.icon ? blip.icon : blip.blipIndex);

  let tooltip: Tooltip;
  if (blipTooltipEnabled) {
    tooltip = new Tooltip();

    blips
      .on("mouseover", (_, blip) => {
        const blipRect = (event?.target as HTMLInputElement).getBoundingClientRect();
        tooltip.show(blip.name, blipRect.x + blipRect.width / 2, blipRect.y);
        highlightLegendItem(blip, vizData.rings[blip.ringIndex].color)
      })
      .on("mouseout", (_, blip) => {
        tooltip.hide();
        unhighlightLegendItem(blip, vizData.global.mainColor)
      });
  }

  // Add legend
  const labelsContainer = container
    .append("g");

  labelsContainer
    .selectAll("g")
    .data(vizData.slices)
    .enter()
    .append('g')
    .attr("id", (_, idx) => `slice-${idx}`);

  for (let sliceIndex = 0; sliceIndex < vizData.slices.length; sliceIndex++) {
    labelsContainer
      .selectAll(`#slice-${sliceIndex}`)
      .append("text")
      .attr("font-family", "Arial, Helvetica")
      .style("font-size", `${vizData.global.blipRadius + 6}px`)
      .attr("font-weight", "bold")
      .attr("fill", vizData.global.mainColor)
      .text(vizData.slices[sliceIndex].name);


    const leftCoords = { x: 0, y: 30 };
    const rightCoords = { x: 200, y: 30 };
    let counter = 0;
    for (let ringIndex = 0; ringIndex < vizData.rings.length; ringIndex++) {
      if (vizData.blips.filter(blip => blip.sliceIndex === sliceIndex && blip.ringIndex === ringIndex).length === 0) {
        continue;
      }
      labelsContainer
        .selectAll(`#slice-${sliceIndex}`)
        .append("text")
        .attr("font-family", "Arial, Helvetica")
        .style("font-size", `${vizData.global.blipRadius + 1}px`)
        .attr("font-weight", "bold")
        .attr("fill", vizData.rings[ringIndex].color)
        .attr("dx", counter % 2 === 0 ? leftCoords.x : rightCoords.x)
        .attr("dy", counter % 2 === 0 ? leftCoords.y : rightCoords.y)
        .text(vizData.rings[ringIndex].name);

      labelsContainer
        .selectAll(`#slice-${sliceIndex}`)
        .append("g")
        .selectAll("g")
        .data(vizData.blips)
        .enter()
        .filter(blip => blip.sliceIndex === sliceIndex && blip.ringIndex === ringIndex)
        .append("a")
        .attr("href", blip => blip.url ? blip.url : "#")
        .attr("target", blip => blip.url && options?.linksInNewTabs ? "_blank" : null)
        .append("text")
        .attr("font-family", "Arial, Helvetica")
        .style("font-size", `${vizData.global.blipRadius}px`)
        .attr("id", blip => `legendItem-${blip.blipIndex}`)
        .attr("fill", vizData.global.mainColor)
        .on("mouseover", (_, blip) => {
          highlightLegendItem(blip, vizData.rings[ringIndex].color)

          // Show tooltip
          const blipItem = document.getElementById("blip-" + blip.blipIndex);
          if (!blipItem) return;
          const blipRect = blipItem.getBoundingClientRect();
          tooltip.show(blip.name, blipRect.x + blipRect.width / 2, blipRect.y);
        })
        .on("mouseout", (_, blip) => {
          unhighlightLegendItem(blip, vizData.global.mainColor)
          tooltip.hide();
        })
        .attr("dx", counter % 2 === 0 ? leftCoords.x : rightCoords.x)
        .attr("dy", () => {
          const step = 15;
          if (counter % 2 === 0) {
            return leftCoords.y += step;
          } else {
            return rightCoords.y += step;
          }
        })
        .attr("class", (blip) => blip.icon != null ? "nf" : "")
        .text(blip => `${blip.icon ? blip.icon : blip.blipIndex}. `)
        .append("tspan")
        .style("font-family", "Arial, Helvetica")
        .text(blip => blip.name)

      if (counter % 2 === 0) {
        leftCoords.y += 30;
      } else {
        rightCoords.y += 30;
      }
      counter+=1;
    }

    // Position slice labels
    const bbox = (labelsContainer.select(`#slice-${sliceIndex}`).node() as SVGSVGElement).getBBox();
    labelsContainer
      .select(`#slice-${sliceIndex}`)
      .attr("transform", `translate(${getXTransform(vizData.slices[sliceIndex], bbox)}, ${getYTransform(vizData.slices[sliceIndex], bbox)})`);
  }


  // Get bounding box of techradar
  const bRect = (techradar.node() as SVGSVGElement).getBBox();

  // footer
  techradar.append("text")
    .attr("transform", `translate(10, ${bRect.height + 20})`)
    .text("▲ moved up     ▼ moved down")
    .attr("xml:space", "preserve")
    .style("font-family", "Arial, Helvetica")
    .attr("fill", vizData.global.mainColor)
    .attr("font-size", `${vizData.global.blipRadius}px`)

  // Position techradar and labels
  techradar
    .attr("width", bRect.width).attr("height", bRect.height + 25)
  container
    .attr("transform", `translate(${Math.abs(bRect.x)}, ${Math.abs(bRect.y)})`);

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
