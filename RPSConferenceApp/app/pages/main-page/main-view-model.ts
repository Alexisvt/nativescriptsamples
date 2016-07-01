import { Observable } from 'data/observable';
import { alert } from 'ui/dialogs';

import { Session, LOADING_ERROR, ConferenceDay, conferenceDays } from '../../shared';
import { SessionViewModel } from '../session-page/session-view-model';
import { SessionsService } from '../../services';

export class MainViewModel extends Observable {

  private _selectedIndex: number;
  private _allSessions: Array<SessionViewModel>;
  private _sessions: Array<SessionViewModel>;
  private _sessionsService: SessionsService;
  private dayHeader: string;
  public isLoading: boolean;
  public isSessionsPage: boolean;
  public selectedViewIndex: number;

  constructor() {
    super();
    this.selectedViewIndex = 1;
    this.isSessionsPage = false;
    this.dayHeader = '';
    this._allSessions = [];
    this._sessions = [];
    this.isLoading = false;
    this._sessionsService = new SessionsService();
    this._selectedIndex = 0;

    // changing the value and notify the view
    this.set('isLoading', true);
    this.set('isSessionsPage', true);
    this.set('dayHeader', conferenceDays[this._selectedIndex].desc);
  }

  public get confDayOptions(): Array<ConferenceDay> {
    return conferenceDays;
  }

  get selectedIndex(): number {
    return this._selectedIndex;
  }

  set selectedIndex(value: number) {
    if (this._selectedIndex !== value) {
      this._selectedIndex = value;
      this.notify({ object: this, eventName: Observable.propertyChangeEvent, propertyName: 'selectedIndex', value: value });

      this.set('dayHeader', conferenceDays[value].desc);
      this.filter();
    }
  }

  public get sessions(): Array<SessionViewModel> {
    return this._sessions;
  }

  public init(): void {
    this._sessionsService.loadSessions<Array<Session>>()
      .then(this.onFulFilled.bind(this), this.onRejected.bind(this));
  }

  private onFulFilled(result: Array<Session>) {
    this.pushSessions(result);
    this.onDataLoaded();
  }

  private onRejected(error: any) {
    console.log(error);
    alert({
      title: 'Loading Error',
      message: LOADING_ERROR,
      okButtonText: 'Ok'
    });
  }

  private pushSessions(sessionsFromService: Array<Session>): void {
    sessionsFromService.forEach((session) => {
      let newSession = new SessionViewModel(session);
      this._allSessions.push(newSession);
    });
  }

  private onDataLoaded(): void {
    this.set('isLoading', false);
    this.filter();
  }

  private filter(): void {
    // this._sessions = this._allSessions;
    this._sessions = this._allSessions.filter(session => {
      return session.startDt.getDate() === conferenceDays[this.selectedIndex].date.getDate();
    });

    if (this.selectedViewIndex === 0) {
      this._sessions = this._sessions.filter(i => { return i.favorite || i.isBreak; });
    }

    this.notify({ object: this, eventName: Observable.propertyChangeEvent, propertyName: 'sessions', value: this._sessions });
  }

  public selectView(index: number, titleText: string) {
    this.selectedViewIndex = index;
    if (this.selectedViewIndex < 2) {
      this.filter();
    }
    this.notify({ object: this, eventName: Observable.propertyChangeEvent, propertyName: 'selectedViewIndex', value: this.selectedViewIndex });
    this.set('actionBarTitle', titleText);
    this.set('isSessionsPage', this.selectedViewIndex < 2);
  }
}