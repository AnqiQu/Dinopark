import { Gender } from "../enums/gender";

export interface Dino {
  id: string,
  name: string,
  species: string,
  gender: Gender,
  digestionPeriod: number,
  isHerbivore: boolean,
  timeAdded: Date,
  parkId: string
}