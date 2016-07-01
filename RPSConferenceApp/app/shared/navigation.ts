import * as frameModule from 'ui/frame';
import {Session} from '../shared';

export function startingPage() {
  return 'pages/main-page/main-page';
}

export function gotoSessionPage(session: Session) {

  let navEntryObj = <frameModule.NavigationEntry>{
    moduleName: 'pages/session-page/session-page',
    context: session,
    transition: {
      name: 'fade',
      duration: 1000,
      curve: 'easeIn'
    }
  };

  frameModule.topmost().navigate(navEntryObj);
}

export function goBack() {
  frameModule.topmost().goBack();
}

export function goToRoomMapPage(session) {

  let navEntryObj = <frameModule.NavigationEntry>{
    moduleName: 'pages/map-page/map-page',
    context: session,
    transition: {
      name: 'fade',
      duration: 1000,
      curve: 'easeIn'
    }
  };

  frameModule.topmost().navigate(navEntryObj);
}