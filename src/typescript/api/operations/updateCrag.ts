import * as t from 'io-ts';
import { getRepository } from 'typeorm';
import Crag from '../../models/Crag';
import CragCodec from '../../codecs/CragCodec';

const updateCrag = async (crag: Crag, data: t.TypeOf<typeof CragCodec>) => {
  Object.assign(crag, data);
  return getRepository(Crag).save(crag);
};

export default updateCrag;
