import { Message } from './message';

export class Chat {
    id: string;
    traderUid: string;
    userUid: string;
    jobPicture?: string;
    jobTitle: string;
    companyPicture?: string;
    companyName: string;
    messages: any[] = [];
    lastContact: number;
}