import { select, symbol, symbolTriangle } from "d3";

import generateTechradarVizData from "./generateTechradarVizData";

import Tooltip from "./Tooltip";

import {
    TechradarBlipState,
    type ColorScheme,
  type TechradarBlipVizData,
  type TechradarData,
  type TechradarOptions,
  type TechradarSliceVizData,
  type TechradarVizData,
} from "./types";

function highlightLegendItem(blip: TechradarBlipVizData, color: string) {
  var legendItem = document.getElementById("legendItem-" + blip.blipIndex);
  if (!legendItem) return;
  legendItem.setAttribute("fill", color);
}

function unhighlightLegendItem(blip: TechradarBlipVizData, color: ColorScheme) {
  var legendItem = document.getElementById("legendItem-" + blip.blipIndex);
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

  //setup base svg
  const techradar = select(targetEl)
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
    .attr("y", rings => rings.y)
    .attr("dy", vizData.global.radarSize/12)
    .attr("text-anchor", "middle")
    .attr("opacity", 0.35)
    .attr("font-family", "Arial, Helvetica")
    .attr("font-size", `${vizData.global.radarSize/21}px`)
    .attr("font-weight", "bold")
    .attr("pointer-events", "none")
    .attr("user-select", "none")
    .attr("fill", rings => rings.color)
    .text(rings => rings.name)

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
    .filter(blip => blip.state === TechradarBlipState.STABLE || blip.state === undefined)
    .append("circle")
    .attr("r", vizData.global.blipRadius)
    .attr("fill", blip => vizData.rings[blip.ringIndex].color);

  blips
    .filter(blip => blip.state === TechradarBlipState.UP)
    .append("path")
    .attr("d", symbol(symbolTriangle).size(vizData.global.blipRadius * 30))
    .attr("fill", blip => vizData.rings[blip.ringIndex].color);

  blips
    .filter(blip => blip.state === TechradarBlipState.DOWN)
    .append("path")
    .attr("d", symbol(symbolTriangle).size(vizData.global.blipRadius * 30))
    .attr("fill", blip => vizData.rings[blip.ringIndex].color)
    .attr("transform", "rotate(-180)");

  blips
    .append("text")
    .style("pointer-events", "none")
    .attr("dy", 4)
    .attr("text-anchor", "middle")
    .attr("fill", blip => vizData.rings[blip.ringIndex].textColor)
    .text(blip => blip.blipIndex);

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
        unhighlightLegendItem(blip, vizData.global.colorScheme)
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
      .attr("font-size", "18px")
      .attr("font-weight", "bold")
      .attr("fill", vizData.global.colorScheme)
      .text(vizData.slices[sliceIndex].name);


    const dx = { left: 0, right: 200 };
    const dy = { left: 30, right: 30 };
    let counter = 0;
    for (let ringIndex = 0; ringIndex < vizData.rings.length; ringIndex++) {
      if (vizData.blips.filter(blip => blip.sliceIndex === sliceIndex && blip.ringIndex === ringIndex).length === 0) {
        continue;
      }
      labelsContainer
        .selectAll(`#slice-${sliceIndex}`)
        .append("text")
        .attr("font-family", "Arial, Helvetica")
        .attr("font-size", "12px")
        .attr("font-weight", "bold")
        .attr("fill", vizData.rings[ringIndex].color)
        .attr("dx", counter % 2 === 0 ? dx.left : dx.right)
        .attr("dy", counter % 2 === 0 ? dy.left : dy.right)
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
        .style("font-family", "Arial, Helvetica")
        .style("font-size", "11px")
        .attr("id", blip => `legendItem-${blip.blipIndex}`)
        .attr("fill", vizData.global.colorScheme)
        .attr("dx", counter % 2 === 0 ? dx.left : dx.right)
        .attr("dy", (_, idx) => (counter % 2 === 0 ? dy.left : dy.right) + ((idx + 1) * 20))
        .on("mouseover", (_, blip) => {
          highlightLegendItem(blip, vizData.rings[ringIndex].color)

          // Show tooltip
          var blipItem = document.getElementById("blip-" + blip.blipIndex);
          if (!blipItem) return;
          const blipRect = blipItem.getBoundingClientRect();
          tooltip.show(blip.name, blipRect.x + blipRect.width / 2, blipRect.y);
        })
        .on("mouseout", (_, blip) => {
          unhighlightLegendItem(blip, vizData.global.colorScheme)
          tooltip.hide();
        })
        .text(blip => `${blip.blipIndex}. ${blip.name}`);

      if (counter % 2 === 0) {
        dy.left += 60;
      } else {
        dy.right += 80;
      }
      counter++;
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
    .attr("transform", `translate(10, ${bRect.height + 15})`)
    .text("▲ moved up     ▼ moved down")
    .attr("xml:space", "preserve")
    .style("font-family", "Arial, Helvetica")
    .style("font-size", "10px");

  // Position techradar and labels
  techradar
    .attr("width", bRect.width).attr("height", bRect.height + 20)
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
