/**
 * Basic and embeddable create/update timestamps
 */
export interface ITimestamps {
  createdAt: Date;
  updatedAt: Date;
}

interface Timestamps extends ITimestamps {}

class Timestamps {
  static mix(base: ITimestamps, data: ITimestamps) {
    base.createdAt = data.createdAt || new Date();
    base.updatedAt = data.updatedAt || new Date();
  }
  constructor(data: ITimestamps) {
    Timestamps.mix(this, data);
  }
}

export default Timestamps;
