import { Page, NavigatedData } from 'ui/page';
import { Button } from 'ui/button';
import { Label } from 'ui/label';
import { ScrollView } from 'ui/scroll-view';
import { EventData } from 'data/observable';
import { GestureEventData } from 'ui/gestures';
import { GridLayout } from 'ui/layouts/grid-layout';

import { SessionViewModel } from '../session-page/session-view-model';
import { Session } from '../../shared';
import * as navigationModule from '../../shared/navigation';
import * as animationHelperModule from '../../shared/animation-helper';


// TODO: Remove later
// import * as fakeDataServiceModule from '../../services';

let vm: SessionViewModel;
let page: Page;

export function pageNavigatingTo(args: NavigatedData) {
  page = <Page>args.object;
  // let firstSession = loadFirstSessionViaFaker();
  // vm = new SessionViewModel(firstSession);
  vm = args.context;
  page.bindingContext = vm;
}

// export function loadFirstSessionViaFaker(): Session {
//   let speakers = fakeDataServiceModule.generateSpeakers();
//   let roomInfos = fakeDataServiceModule.generateRoomInfo();
//   let sessions = fakeDataServiceModule.generateSessions(speakers, roomInfos);

//   let nonBreakSessions = sessions.filter(function (session) {
//     return !session.isBreak && session.speakers.length > 0;
//   });

//   return nonBreakSessions[0];
// }

export function toggleFavorite(args: EventData) {
  let gl = <GridLayout>args.object;
  let img = gl.getViewById('imgFav');

  animationHelperModule.popAnimate(img).then(() => {
    vm.toggleFavorite();
  });
}

export function toggleDescription(args: EventData) {
  let btn = <Button>args.object;
  let txtDesc = <Label>page.getViewById('txtDescription');
  let scroll = <ScrollView>page.getViewById('scroll');

  if (btn.text === 'MORE') {
    btn.text = 'LESS';
    txtDesc.text = vm.description;
  }
  else {
    btn.text = 'MORE';
    txtDesc.text = vm.descriptionShort;
    scroll.scrollToVerticalOffset(0, false);
  }
}

export function backTap(args: GestureEventData) {
  navigationModule.goBack();
}

export function showMapTap(args: GestureEventData) {
  navigationModule.goToRoomMapPage(vm);
}