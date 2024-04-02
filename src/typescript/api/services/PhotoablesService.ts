import * as Rest from "typescript-rest";
import * as Swagger from "typescript-rest-swagger";

import myDataSource from "../../db/myDataSource.js";
import addPhotoToPhotoable from "../operations/addPhotoToPhotoable.js";
import User from "../../models/User.js";
import Photoable from "../../models/Photoable.js";
import PhotoRepository from "../../models/repositories/PhotoRepository.js";
import getRoute from "../operations/getRoute.js";
import getBoulder from "../operations/getBoulder.js";
import uploadFile from "../operations/uploadFile.js";

const getPhotos = (id: number) => {
  return myDataSource.getRepository(Photoable).findOne({
    where: { id },
    relations: ["photos", "photos.upload", "photos.user"],
  });
};

/**
 * Photoables service
 */
@Rest.Path("/photoables")
export default class PhotoablesService {
  @Rest.GET
  @Rest.Path(":id")
  @Swagger.Tags("photoables")
  @Swagger.Response<object>(200, "Get data a photoable")
  public async getPhotoable(@Rest.PathParam("id") id: string) {
    return getPhotos(parseInt(id));
  }

  // We allow clients to get data directly from an "entity" route as it were
  @Rest.GET
  @Rest.Path("/routes/:id")
  @Swagger.Tags("photoables")
  @Swagger.Response<object>(302, "Get the photoable for a route")
  public async photoableForRoute(@Rest.PathParam("id") id: string) {
    return getRoute(id)
      .then((route) => {
        return myDataSource.manager
          .withRepository(PhotoRepository)
          .findOrGetPhotoable(route);
      })
      .then((photoable) => {
        return getPhotos(photoable.id);
      });
  }

  @Rest.GET
  @Rest.Path("/boulder/:id")
  @Swagger.Tags("photoables")
  @Swagger.Response<object>(302, "Get the photoable for a boulder")
  public async photoableForBoulder(@Rest.PathParam("id") id: string) {
    return getBoulder(id)
      .then((boulder) => {
        return myDataSource.manager
          .withRepository(PhotoRepository)
          .findOrGetPhotoable(boulder);
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
  @Rest.Path(":id/photos")
  @Swagger.Tags("photoables")
  @Swagger.Response<object>(201, "Add a photo for a photoable")
  public async addPhoto(
    @Rest.PathParam("id") id: string,
    @Rest.FileParam("photo") file: Express.Multer.File,
    @Rest.FormParam("title") title: string,
    @Rest.FormParam("description") description?: string
  ) {
    const user = await myDataSource
      .getRepository(User)
      .findOne({ where: { id: 1 } });
    const photoable = await myDataSource.getRepository(Photoable).findOne({
      where: { id: parseInt(id) },
    });
    const upload = await uploadFile(file, "photos");
    return addPhotoToPhotoable(
      photoable,
      title,
      description,
      upload,
      user
    ).then((photo) => {
      return new Rest.Return.NewResource(`/photoables/${photoable.id}`, photo);
    });
  }
}

type PhotoablesServiceType = typeof PhotoablesService.prototype;
export type { PhotoablesServiceType };
