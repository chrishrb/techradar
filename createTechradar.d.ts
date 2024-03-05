import { type TechradarData, type TechradarOptions, type TechradarVizData } from "./types";
declare const createTechradar: (targetEl: any, data: TechradarData, options?: TechradarOptions) => {
    vizData: TechradarVizData;
    destroy: () => void;
};
export default createTechradar;
