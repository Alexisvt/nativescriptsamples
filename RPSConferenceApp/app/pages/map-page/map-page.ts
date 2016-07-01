import { Page, NavigatedData } from 'ui/page';
import { GestureEventData, SwipeGestureEventData, SwipeDirection } from 'ui/gestures';
import { RoomInfo } from '../../shared/interfaces';
import { MapViewModel } from '../map-page/map-view-model';
import * as animationHelperModule from '../../shared/animation-helper';

import * as roomMapsServiceModule from '../../services/room-map-service';
import * as navigationModule from '../../shared/navigation';

let vm: MapViewModel;

export function pageNavigatingTo(args: NavigatedData) {

  let page = <Page>args.object;
  let imgMap = page.getViewById('imgMap');
  imgMap.opacity = 0.2;
  imgMap.scaleX = 0.2;
  imgMap.scaleY = 0.2;

  if (!page || !page.navigationContext)
    return;

  vm = new MapViewModel(<RoomInfo>page.navigationContext.roomInfo);
  vm.isLoading = true;

  roomMapsServiceModule.getRoomImage().then(function (imageSource) {
    vm.set('image', imageSource);
    vm.isLoading = false;

    animationHelperModule.fadeZoom(imgMap);
  });

  page.bindingContext = vm;
}

export function backTap(args: GestureEventData) {
  navigationModule.goBack();
}

export function backSwipe(args: SwipeGestureEventData) {
  if (args.direction === SwipeDirection.right) {
    navigationModule.goBack();
  }
}