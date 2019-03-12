import { getRepository } from 'typeorm';
import Crag from '../../models/Crag';

const getCragTrail = (id: number | string) => {
  return getRepository(Crag)
  .findOne({
    where: [
      { name: id },
      { id },
    ],
    relations: [
      'trail',
      'trail.nodes',
      'trail.nodes.edges',
      'trail.nodes.edges.a',
      'trail.nodes.edges.b'
    ]
  })
  .then((crag) => {
    return crag;
  });
};

export default getCragTrail;
