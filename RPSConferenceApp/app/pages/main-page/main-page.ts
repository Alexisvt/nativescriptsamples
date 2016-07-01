import { EventData } from 'data/observable';
import { GestureEventData } from 'ui/gestures';
import { Page } from 'ui/page';
import { Button } from 'ui/button';
import { ItemEventData } from 'ui/list-view';
import { GridLayout } from 'ui/layouts/grid-layout';

import { MainViewModel } from './main-view-model';
import { SessionViewModel } from '../session-page/session-view-model';
import * as navigationModule from '../../shared/navigation';
import * as animationHelperModule from '../../shared/animation-helper';

let page: Page;
let vm = new MainViewModel();
const SIDE_DRAWER_ID = 'SideDrawer';

export function pageLoaded(args: EventData) {
  page = <Page>args.object;
  page.bindingContext = vm;
  vm.init();
}

export function selectSession(args: ItemEventData) {
  let session = <SessionViewModel>args.view.bindingContext;

  if (!session.isBreak) {
    navigationModule.gotoSessionPage(session);
  }
}

export function toggleFavorite(args: GestureEventData) {
  let session = <SessionViewModel>args.view.bindingContext;

  let gl = <GridLayout>args.object;
  let img = gl.getViewById('imgFav');

  animationHelperModule.popAnimate(img).then(() => {
    session.toggleFavorite();
  });

}

export function showSlideout(args: GestureEventData) {
  let slideBar = <any>page.getViewById(SIDE_DRAWER_ID);
  slideBar.showDrawer();
}

export function selectView(args: EventData) {
  let btn = <Button>args.object;
  let slideBar = <any>page.getViewById(SIDE_DRAWER_ID);
  slideBar.closeDrawer();

  vm.selectView(parseInt((<any>btn).pato), btn.text);
}