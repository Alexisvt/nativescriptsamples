import { FavouriteSession } from '../shared';
import { SessionViewModel } from '../pages/session-page/session-view-model';
import * as appSettingsModule from 'application-settings';

const FAVOURITES = 'FAVOURITES';

export let favourites: Array<FavouriteSession>;

try {
  favourites = <Array<FavouriteSession>>JSON.parse(appSettingsModule.getString(FAVOURITES, '[]'));
} catch (error) {
  console.log(`Error while retrieving favourites ${error}`);
  favourites = new Array<FavouriteSession>();
}

export function findSessionIndexInFavourites(sessionId: string): number {

  for (let i = 0; i < favourites.length; i++) {
    if (favourites[i].sessionId === sessionId) {
      return i;
    }
  }
  return -1;
}

export function addToFavourites(session: SessionViewModel) {
  if (findSessionIndexInFavourites(session.id) >= 0) {
    // Session already added to favourites
    return;
  }

  persistSessionToFavourites(session);
}

function persistSessionToFavourites(session: SessionViewModel): void {
  favourites.push({
    sessionId: session.id,
    calendarEventId: session.calendarEventId
  });
  updateFavourites();
}

function updateFavourites(): void {
  let newValue = JSON.stringify(favourites);
  console.log(`favourites ${newValue}`);
  appSettingsModule.setString(FAVOURITES, newValue);
}

export function removeFromFavourites(session: SessionViewModel): void {
  let index = findSessionIndexInFavourites(session.id);
  if (index >= 0) {
    favourites.splice(index, 1);
    updateFavourites();
  }
}