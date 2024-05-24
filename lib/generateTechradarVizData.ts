import {
  pie,
  arc,
  scaleLinear,
  scaleSequential,
  interpolateRainbow,
} from "d3";

import {
  type TechradarData,
  type TechradarVizOptions,
  type TechradarVizData,
  type TechradarSliceVizData,
  type TechradarBlipVizData,
  type TechradarAreaVizData,
  type TechradarRingVizData,
  type Anchor,
} from "./types";
import seedrandom from "seedrandom";

const generateTechradarVizData = (
  data: TechradarData,
  options?: TechradarVizOptions
): TechradarVizData => {
  const { radarSize = 900, blipRadius = 12, colorScheme = 'white' } = options || {};
  const mainColor = colorScheme === 'white' ? 'black' : 'white';

  //setup base scales
  const sliceColorScale = scaleSequential()
    .domain([0, data.rings.length])
    .interpolator(interpolateRainbow);


  const radiusScale = (ringIndex: number): number => {
    // Make the first ring a bit bigger
    let radius = (radarSize / (2 * (data.rings.length+0.5))) * ringIndex;
    if (ringIndex > 0) {
      radius += (radarSize / (2 * (data.rings.length+1))) / 2;
    }
    return radius;
  }

  const radius = (sliceIndex: number): number => {
    return (360 / data.slices.length) * sliceIndex;
  }

  const getAnchor = (x: number, y: number): Anchor => {
    const anchor: Anchor = {x: 'left', y: 'top'};
    if (x < -10) {
      anchor.x = "right";
    } else if (x > 10) {
      anchor.x = "left";
    } else {
      anchor.x = "middle";
    }

    if (y < -10) {
      anchor.y = "bottom"
    } else {
      anchor.y = "top";
    }
    return anchor;
  }

  //generate arc per slice
  const arcs = pie()
    .value(1)(data.slices.map((_, index) => index))
    .sort();

  const rand = seedrandom("seed");

  //generate ring derived data from data.rings
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const ringsDerivedData = data.rings.reduce(
    (acc: { rings: TechradarRingVizData[]; pathInfoList: any; }, ringData, ringIndex) => {
      const innerRadius = radiusScale(ringIndex);
      const outerRadius = radiusScale(ringIndex + 1);

      //arc path generator
      const generator = arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);

      const ring: TechradarRingVizData = {
        y: -outerRadius,
        color: ringData.color ? ringData.color : sliceColorScale(ringIndex),
        textColor: "white",
        ...ringData,
      };

      acc.rings.push(ring);

      acc.pathInfoList.push({
        blipDistanceScale: scaleLinear().range([
          innerRadius + blipRadius,
          outerRadius - blipRadius,
        ]),
        generator,
      });

      return acc;
    },
    {
      rings: [],
      pathInfoList: [],
    }
  );

  const minBlipCenterDistance = blipRadius * 2.2;

  //generate VizData ({slices, areas, blips}) from combining data.slices with data.rings
  const slicesDerivedData = data.slices.reduce(
    (acc: { areas: TechradarAreaVizData[]; blips: TechradarBlipVizData[]; slices: TechradarSliceVizData[]; }, sliceData, sliceIndex) => {
      const arc = arcs[sliceIndex];

      const { blipsByRing, ...sliceDetails } = sliceData;

      // Calculate the position of the slice
      const alpha = radius(sliceIndex) + 0.5 * (radius(sliceIndex + 1) - radius(sliceIndex))
      const gamma = 90
      const beta = 180 - gamma - alpha

      const radarSizeWithPadding = radarSize + 50;
      const x = (radarSizeWithPadding / 2) * Math.sin(alpha * Math.PI / 180)
      const y = -1 * (radarSizeWithPadding / 2) * Math.sin(beta * Math.PI / 180)

      const slice: TechradarSliceVizData = {
        ...sliceDetails,
        x: x,
        y: y,
        anchor: getAnchor(x, y),
        // startAngle: radius(sliceIndex),
        // endAngle: radius(sliceIndex + 1),
      };

      //generate areas and blips for all of this slice's rings
      const areasAndBlips = data.rings.reduce(
        (acc: { areas: TechradarAreaVizData[]; blips: TechradarBlipVizData[]; }, ringData, ringIndex) => {
          const ringPathInfo = ringsDerivedData.pathInfoList[ringIndex];

          //generate area that is the interception of current slice and ring
          const area: TechradarAreaVizData = {
            sliceIndex,
            ringIndex,
            path: ringPathInfo.generator(arc),
          };

          acc.areas.push(area);

          const blipDataList = blipsByRing[ringData.id];

          //avoid generating blips for the current slice's ring, if there aren't any
          if (!blipDataList) {
            return acc;
          }

          //calculate blip positions
          const positions = blipDataList.reduce((acc: any[]) => {
            //repetively try to generate a new random position that doesn't collide with other existing ones
            for (let tries = 1; ; tries++) {
              //calculate random distance within the current ring
              const distance = ringPathInfo.blipDistanceScale(rand());

              //calculate angle padding to avoid blip overlapping adjacent slices
              const anglePadding = Math.asin(blipRadius / distance);

              const minAngle = arc.startAngle + anglePadding;
              const maxAngle = arc.endAngle - anglePadding;

              const blipAngleScale = scaleLinear().range([minAngle, maxAngle]);

              //if there is enough space, calculate random angle within the current ring, otherwise center it
              const angle =
                maxAngle > minAngle
                  ? blipAngleScale(rand())
                  : blipAngleScale(0.5);

              //convert to polar coords
              const x = distance * Math.cos(angle - Math.PI / 2);
              const y = distance * Math.sin(angle - Math.PI / 2);

              //if it hasn't hit the limit of tries and overlaps another blip, go for another try
              if (
                tries < 10 &&
                acc.some(
                  other =>
                    Math.hypot(other.x - x, other.y - y) < minBlipCenterDistance
                )
              ) {
                //go for another try since it overlaps another
                continue;
              }

              return acc.concat({
                angle,
                distance,
                x,
                y,
              });
            }
          }, []);

          //sort positions taking into account their angle and distance
          positions.sort(function(a, b) {
            const angleDiff = a.angle - b.angle;
            const distanceDiff = a.distance - b.distance;

            //if the angle difference is greater than the distance (to the center) difference, return angleDiff as the sorting factor otherwise return distanceDiff
            return Math.abs(
              Math.sin(angleDiff) * (b.distance + distanceDiff / 2)
            ) > Math.abs(distanceDiff)
              ? angleDiff
              : distanceDiff;
          });

          //generate and add new blips
          acc.blips = acc.blips.concat(
            blipDataList.map((blipData, blipIndex): TechradarBlipVizData => {
              const position = positions[blipIndex];

              return {
                ...blipData,
                sliceIndex,
                ringIndex,
                blipIndex: 0, // INFO: dummy value, is overriden below
                x: position.x,
                y: position.y,
              };
            })
          );

          return acc;
        },
        {
          areas: [],
          blips: [],
        }
      );

      return {
        areas: acc.areas.concat(areasAndBlips.areas),
        blips: acc.blips.concat(areasAndBlips.blips).map((blip, idx) => {return {...blip, blipIndex: idx + 1}}),
        slices: acc.slices.concat(slice),
      };
    },
    {
      areas: [],
      blips: [],
      slices: [],
    }
  );

  return {
    global: {
      radarSize,
      blipRadius,
      mainColor: mainColor,
    },
    rings: ringsDerivedData.rings,
    ...slicesDerivedData,
  };
};

export default generateTechradarVizData;
