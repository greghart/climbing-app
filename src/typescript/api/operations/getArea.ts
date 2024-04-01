import getAreas, { type Options } from "./getAreas";

const getArea = (id: string | number, options?: Options) => {
  return getAreas([id], options).then(([area]) => area);
};

export default getArea;
