import { DinoFeeding } from './dino-feeding.interface';

export interface Dino {
  id: string,
  name: string,
  species: string,
  gender: string,
  digestionPeriod: number,
  isHerbivore: boolean,
  timeAdded: Date,
  parkId: string,
  timeLastFed?: Date
}
