import { Observable } from 'data/observable';
import { Session, Speaker, RoomInfo } from '../../shared';
import * as favoritesServiceModule from '../../services/favorites-service';

export class SessionViewModel extends Observable implements Session {

  private _session: Session;
  private _favorite: boolean;
  private _startDt: Date;
  private _endDt: Date;

  constructor(source?: Session) {
    super();

    this._favorite = false;

    if (source) {
      this._session = source;
      this._startDt = this.fixDate(new Date(source.start));
      this._endDt = this.fixDate(new Date(source.end));
    }
  }


  public get id(): string {
    return this._session.id;
  }

  public get title(): string {
    return this._session.title;
  }

  public get roomInfo(): RoomInfo {
    return this._session.roomInfo;
  }

  public get start(): string {
    return this._session.start;
  }

  public get end(): string {
    return this._session.end;
  }

  public get speakers(): Array<Speaker> {
    return this._session.speakers;
  }

  public get isBreak(): boolean {
    return this._session.isBreak;
  }

  public get description(): string {
    return this._session.description;
  }

  public get descriptionShort(): string {
    if (this.description.length > 160) {
      return this.description.substr(0, 160) + '...';
    }
    else {
      return this.description;
    }
  }

  public get calendarEventId(): string {
    return this._session.calendarEventId;
  }

  public get room(): string {
    if (this._session.room) {
      return this._session.room;
    }
    if (this._session.roomInfo) {
      return this._session.roomInfo.name;
    }
    return null;
  }

  public get favorite(): boolean {
    return this._favorite;
  }

  public get startDt(): Date {
    return this._startDt;
  }

  public get endDt(): Date {
    return this._endDt;
  }

  get range(): string {
    let startMinutes = this.startDt.getMinutes() + '';
    let endMinutes = this.endDt.getMinutes() + '';
    let startAM = this.startDt.getHours() < 12 ? 'am' : 'pm';
    let endAM = this.endDt.getHours() < 12 ? 'am' : 'pm';

    let startHours = (this.startDt.getHours() <= 12 ? this.startDt.getHours() : this.startDt.getHours() - 12) + '';
    let endHours = (this.endDt.getHours() <= 12 ? this.endDt.getHours() : this.endDt.getHours() - 12) + '';

    return (startHours.length === 1 ? '0' + startHours : startHours) + ':' + (startMinutes.length === 1 ? '0' + startMinutes : startMinutes) + startAM +
      ' - ' + (endHours.length === 1 ? '0' + endHours : endHours) + ':' + (endMinutes.length === 1 ? '0' + endMinutes : endMinutes) + endAM;
  }

  public set favorite(value: boolean) {
    if (this._favorite !== value && !this._session.isBreak) {
      this._favorite = value;
      this.notify({ object: this, eventName: Observable.propertyChangeEvent, propertyName: 'favorite', value: this._favorite });
    }
    this._favorite = value;
  }

  public toggleFavorite(): void {
    this.favorite = !this._favorite;
    if (this.favorite) {
      favoritesServiceModule.addToFavourites(this);
    }
    else {
      favoritesServiceModule.removeFromFavourites(this);
    }
  }

  private fixDate(date: Date) {
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
  }

}