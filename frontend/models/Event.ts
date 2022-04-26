import TokenSeriesJson from './TokenSeriesJson';

export default interface Event {
  name: string;
  description: string;
  modality: number;
  capacity: number;
  date: string;
  time: string;
  status: number;
  index: number;
  banner: string;
  organizer: string;
  ticket_type: Array<string>;
  tickets: Array<TokenSeriesJson>;
}
