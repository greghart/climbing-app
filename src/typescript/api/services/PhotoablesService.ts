import * as Rest from 'typescript-rest';
import * as Swagger from 'typescript-rest-swagger';
import { getRepository, getCustomRepository } from 'typeorm';

import addPhotoToPhotoable from '../operations/addPhotoToPhotoable';
import User from '../../models/User';
import Photoable from '../../models/Photoable';
import PhotoRepository from '../../models/repositories/PhotoRepository';
import getRoute from '../operations/getRoute';
import getBoulder from '../operations/getBoulder';
import getArea from '../operations/getArea';
import Crag from '../../models/Crag';
import uploadFile from '../operations/uploadFile';

const getPhotos = (id: string | number) => {
  return getRepository(Photoable).findOne(id, {
    relations: [
      'photos',
      'photos.upload',
      'photos.user'
    ],
  });
};

/**
 * Photoables service
 */
@Rest.Path('/photoables')
export default class PhotoablesService {

  @Rest.GET
  @Rest.Path(':id')
  @Swagger.Tags('photoables')
  @Swagger.Response<object>(200, 'Get data a photoable')
  public async getPhotoable(
    @Rest.PathParam('id') id: string,
  ) {
    return getPhotos(id);
  }

  // We allow clients to get data directly from an "entity" route as it were
  @Rest.GET
  @Rest.Path('/routes/:id')
  @Swagger.Tags('photoables')
  @Swagger.Response<object>(302, 'Get the photoable for a route')
  public async photoableForRoute(
    @Rest.PathParam('id') id: string,
  ) {
    return getRoute(id)
    .then((route) => {
      return getCustomRepository(PhotoRepository).findOrGetPhotoable(route);
    })
    .then((photoable) => {
      return getPhotos(photoable.id);
    });
  }

  @Rest.GET
  @Rest.Path('/boulder/:id')
  @Swagger.Tags('photoables')
  @Swagger.Response<object>(302, 'Get the photoable for a boulder')
  public async photoableForBoulder(
    @Rest.PathParam('id') id: string,
  ) {
    return getBoulder(id)
    .then((boulder) => {
      return getCustomRepository(PhotoRepository).findOrGetPhotoable(boulder);
    })
    .then((photoable) => {
      return getPhotos(photoable.id);
    });
  }

  // @Rest.GET
  // @Rest.Path('/area/:id')
  // @Swagger.Tags('photoables')
  // @Swagger.Response<object>(302, 'Get the photoable for a area')
  // public async photoableForArea(
  //   @Rest.PathParam('id') id: string,
  // ) {
  //   return getArea(id)
  //   .then((area) => {
  //     return getCustomRepository(PhotoRepository).findOrGetPhotoable(area);
  //   })
  //   .then((photoable) => {
  //     return getPhotos(photoable.id);
  //   });
  // }

  // @Rest.GET
  // @Rest.Path('/crag/:id')
  // @Swagger.Tags('photoables')
  // @Swagger.Response<object>(302, 'Get the photoable for a crag')
  // public async photoableForCrag(
  //   @Rest.PathParam('id') id: string,
  // ) {
  //   return getRepository(Crag).findOne(id)
  //   .then((crag) => {
  //     return getCustomRepository(PhotoRepository).findOrGetPhotoable(crag);
  //   })
  //   .then((photoable) => {
  //     return getPhotos(photoable.id);
  //   });
  // }

  @Rest.POST
  @Rest.Path(':id/photos')
  @Swagger.Tags('photoables')
  @Swagger.Response<object>(201, 'Add a photo for a photoable')
  public async addPhoto(
    @Rest.PathParam('id') id: string,
    @Rest.FileParam('photo') file: Express.Multer.File,
    @Rest.FormParam('title') title: string,
    @Rest.FormParam('description') description?: string,
  ) {
    const user = await getRepository(User).findOne(1);
    const photoable = await getRepository(Photoable).findOne(id);
    const upload = await uploadFile(file, 'photos');
    return addPhotoToPhotoable(
      photoable,
      title,
      description,
      upload,
      user
    )
    .then((photo) => {
      return new Rest.Return.NewResource(`/photoables/${photoable.id}`, photo);
    });
  }

}

type PhotoablesServiceType = typeof PhotoablesService.prototype;
export { PhotoablesServiceType };
