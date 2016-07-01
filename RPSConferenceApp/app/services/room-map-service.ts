import { RoomInfo } from '../shared/interfaces';
import * as imageSourceModule from 'image-source';

export let defaultImageSource = imageSourceModule.fromResource('conf');

// export function getRoomImage(info: RoomInfo, update: (image: imageSourceModule.ImageSource) => void) {

//   // simulate image loading from remote source
//   setTimeout(function () {
//     update(defaultImageSource);
//   }, 2000);
// }

export function getRoomImage() {

  // simulate image loading from remote source
  return new Promise((resolve: (image: imageSourceModule.ImageSource) => void) => {
    setTimeout(function () {
      resolve(defaultImageSource);
    }, 2000);
  });

}