import { Session, Speaker, RoomInfo, ConferenceDay, conferenceDays, ConfTimeSlot } from '../shared';
import * as faker from 'faker';
import * as fileSystemModule from 'file-system';


const NUM_SPEAKERS = 40;
const NUM_ROOM_INFOS = 10;
const SESSION_LENGTH = 60;

export function generateSpeakers(): Array<Speaker> {

  let speakerList: Array<Speaker> = [];
  let avatarsMen = getSpeakerAvatars('images/speakers/base64/men.txt');
  let avatarsWomen = getSpeakerAvatars('images/speakers/base64/women.txt');

  for (let i = 0; i < NUM_SPEAKERS; i++) {

    let genderBool = +faker.random.boolean();
    let firstName = faker.name.lastName();
    let lastName = faker.name.lastName(genderBool);
    let picture = genderBool ? avatarsMen[faker.random.number(avatarsMen.length - 1)] : avatarsWomen[faker.random.number(avatarsWomen.length - 1)];

    let speakerItem = <Speaker>{
      id: faker.random.uuid(),
      name: `${firstName} ${lastName}`,
      title: faker.name.jobTitle(),
      company: faker.company.companyName(),
      picture: picture,
      twitterName: `@${faker.internet.userName(firstName, lastName)}`
    };

    speakerList.push(speakerItem);
  }

  return speakerList;
}

export function generateRoomInfo() {

  let roomInfoList = <Array<RoomInfo>>[];

  for (let i = 0; i < NUM_ROOM_INFOS; i++) {
    let roomItem = <RoomInfo>{
      roomId: faker.random.uuid(),
      name: `${faker.address.streetName()} ${faker.random.number(10)}`,
      url: faker.internet.domainName(),
      theme: faker.lorem.words(1)
    };

    roomInfoList.push(roomItem);
  }

  return roomInfoList;
}

export function generateSessions(speakers: Array<Speaker>, roomInfos: Array<RoomInfo>): Array<Session> {

  let sessionList: Array<Session> = [];
  let idSeed = 1000;

  for (let confDay of conferenceDays) {
    let timeSlots = generateTimeSlots(confDay);
    for (let confTimeSlot of timeSlots) {
      if (confTimeSlot.isBreak) {
        // break session
        let breakSession = <Session>{
          id: (idSeed++).toString(),
          title: toTitleCase(confTimeSlot.title),
          isBreak: true,
          start: confTimeSlot.start.toString(),
          end: confTimeSlot.end.toString(),
          room: '',
          roomInfo: null,
          speakers: [],
          description: '',
          descriptionShort: '',
          calendarEventId: ''
        };
        sessionList.push(breakSession);
      }
      else {
        // speaker session
        let subSpeakers = getRandomArrayElements(speakers, faker.random.number(3));
        let roomInfo = roomInfos[faker.random.number(roomInfos.length - 1)];

        let speakerSession: Session = {
          id: (idSeed++).toString(),
          title: toTitleCase(faker.company.bs()),
          isBreak: false,
          start: confTimeSlot.start.toString(),
          end: confTimeSlot.end.toString(),
          room: roomInfo.name,
          roomInfo: roomInfo,
          speakers: subSpeakers,
          description: faker.lorem.paragraph(),
          descriptionShort: faker.lorem.sentence(),
          calendarEventId: faker.random.uuid()
        };
        sessionList.push(speakerSession);
      }
    }
  }

  return sessionList;
}

function generateTimeSlots(confDay: ConferenceDay): Array<ConfTimeSlot> {
  let timeSlotList: Array<ConfTimeSlot> = [];
  let startTimeList = getTimeRange(addMinutes(confDay.date, 240), addMinutes(confDay.date, 780), SESSION_LENGTH);
  for (let startTime of startTimeList) {
    let isBreak = false;
    let sessionTitle = '';
    if (startTime.getHours() === 4) {
      isBreak = true;
      sessionTitle = 'Welcome Message';
    }
    else if (startTime.getHours() === 8) {
      isBreak = true;
      sessionTitle = 'Lunch Break';
    }
    let cTimeSlot: ConfTimeSlot = { title: sessionTitle, isBreak: isBreak, start: startTime, end: addMinutes(startTime, SESSION_LENGTH) };
    timeSlotList.push(cTimeSlot);
  }
  return timeSlotList;
}

function getTimeRange(startTime: Date, endTime: Date, minutesBetween: number): Array<Date> {
  let startTimeList: Array<Date> = [];
  let diffInMinutes = Math.round((endTime.getTime() - startTime.getTime()) / 60000);
  let periods: number = diffInMinutes / minutesBetween;
  for (let i = 0; i <= periods; i++) {
    let periodStart = addMinutes(startTime, (minutesBetween * i));
    startTimeList.push(periodStart);
  }
  return startTimeList;
}

function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60000);
}

function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, function (txt) { return `${txt.charAt(0).toUpperCase()}${txt.substr(1).toLowerCase()}`; });
}

function getRandomArrayElements(arr: any[], count: number) {
  let shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
  while (i-- > min) {
    index = Math.floor((i + 1) * Math.random());
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }
  return shuffled.slice(min);
}

function getSpeakerAvatars(path: string): Array<string> {
  let avatarList: Array<string> = [];
  let currentAppFolder = fileSystemModule.knownFolders.currentApp();
  let file = currentAppFolder.getFile(path);
  let fileText = file.readTextSync();

  let lines = fileText.split('\n');
  for (let i = 0; i < lines.length; i++) {
    avatarList.push('data:image/png;base64,' + lines[i]);
  }
  return avatarList;
}