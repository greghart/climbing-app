import Photo, { type IPhoto } from "./Photo.js";
import Topogon, { type ITopogon } from "./Topogon.js";

/**
 * A Topo represents drawn diagrams on top of topo, intending
 * to show route lines, sections of a wall, or a topo of a crag
 * showing areas from afar.
 *
 * Features:
 *  * Vector based canvas editor to generate topos
 *  * A Topo can be associated with any Topoable, and also have
 *    additional relationships with crags, areas, boulders, or routes.
 *  * A Topo will have various tools for generating diagrams
 *    * Path -- basic paths, or even a closed polygon
 *    * Icons -- signal hold types, or mark flexing holds, etc.
 *    * Labels -- while associations will help us relate which path applies to what,
 *      labels can bake that into the image.
 */
export type ITopo = {
  id: number;
  title: string;
  photo: IPhoto;
  topogons?: ITopogon[];
  // The scale of the photo when topogons were created.
  scale: number;
};

interface Topo extends Omit<ITopo, "photo" | "topogons"> {
  photo: Photo;
  topogons?: Topogon[];
}

class Topo {
  constructor(data: ITopo) {
    this.id = data.id;
    this.title = data.title;
    this.photo = new Photo(data.photo);
    this.topogons = (data.topogons || []).map(
      (topogon) => new Topogon(topogon)
    );
  }
}

export default Topo;
