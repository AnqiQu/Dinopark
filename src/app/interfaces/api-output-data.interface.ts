import { Dino } from './dino.interface';
import { DinoLocation } from './dino-location.interface';
import { Maintenance } from './maintenance.interface';

export interface ApiOutputData {
    dinos: Dino[];
    dinoLocations: DinoLocation[];
    maintenances: Maintenance[];
}