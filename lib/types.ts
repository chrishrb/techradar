export type FontColor = 'black' | 'white';

export type TechradarRingData = {
  id: string,
  name: string,
};

export type TechradarBlipData = {
  name: string,
  description?: string,
  url?: string,
};

export type TechradarSliceData = {
  name: string,
  blipsByRing: {
    [ringId: string]: TechradarBlipData[] | undefined,
  },
};

export type TechradarData = {
  slices: TechradarSliceData[],
  rings: TechradarRingData[],
};

export type TechradarVizOptions = {
  radarSize?: number,
  blipRadius?: number,
  fontColor?: FontColor,
};

export type TechradarOptions = TechradarVizOptions & {
  blipTooltipEnabled?: boolean,
  linksInNewTabs?: boolean,
};

export type TechradarAreaVizData = {
  sliceIndex: number,
  ringIndex: number,
  path: string,
};

export type TechradarBlipVizData = TechradarBlipData & {
  blipIndex: number,
  sliceIndex: number,
  ringIndex: number,
  x: number,
  y: number,
};

export type Anchor = {
  x: 'left' | 'middle' | 'right',
  y: 'top' | 'bottom',
}
export type TechradarSliceVizData = {
  name: string,
  x: number,
  y: number,
  anchor: Anchor,
};

export type TechradarRingVizData = TechradarRingData & {
  color: string,
  textColor: string,
  y: number,
};

export type TechradarVizData = {
  global: {
    radarSize: number,
    blipRadius: number,
    fontColor: 'black' | 'white',
  },
  areas: TechradarAreaVizData[],
  blips: TechradarBlipVizData[],
  slices: TechradarSliceVizData[],
  rings: TechradarRingVizData[],
};
