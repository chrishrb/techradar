import { useEffect, useRef } from "react";
import createTechradar from "./createTechradar";
import { TechradarData, TechradarOptions } from "./types";

export const Techradar = ({ data, options }: { data: TechradarData, options?: TechradarOptions }) => {
  const ref = useRef(null);

  useEffect(() => {
    createTechradar(ref.current, data, options);
  }, [data, options]);

  return (
    <div ref={ref} />
  );
}
