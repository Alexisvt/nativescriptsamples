import * as fakeDataServiceModule from './fake-data-service';
import * as httpModule from 'http';

import * as constantModule from '../shared/constants';

export class SessionsService {

  private _useHttpService: boolean;

  constructor() {
    this._useHttpService = false;
  }

  public loadSessions<T>(): Promise<T> {
    if (this._useHttpService) {
      return this.loadSessionsViaHttp<T>();
    } else {
      return this.loadSessionsViaFaker<T>();
    }
  }

  private loadSessionsViaHttp<T>(): Promise<T> {
    let reqParams: httpModule.HttpRequestOptions = {
      url: `${constantModule.AZURE_URL}${constantModule.AZURE_TABLE_PATH}${constantModule.AZURE_TABLE_NAME}?$orderby=start`,
      method: 'GET',
      headers: constantModule.AZURE_VERSION_HEADER
    };

    return httpModule.getJSON<T>(reqParams);
  }

  private loadSessionsViaFaker<T>(): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      let speakers = fakeDataServiceModule.generateSpeakers();
      let roomInfos = fakeDataServiceModule.generateRoomInfo();
      let sessions = <any>fakeDataServiceModule.generateSessions(speakers, roomInfos);

      // TODO: investigate how to type sessions var correctly and remove any
      resolve(sessions);
    });
  }
}