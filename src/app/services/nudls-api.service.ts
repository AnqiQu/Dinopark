import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Dino } from '../interfaces/dino.interface';
import { DinoLocation } from '../interfaces/dino-location.interface';
import { Maintainance } from '../interfaces/maintainance.interface';
import { EventKind } from '../enums/event-kind'

@Injectable({ providedIn: 'root' })
export class NudlsApiService {

  dinos: Dino[];
  dinoLocations: DinoLocation[];
  maintainances: Maintainance[];

  constructor(
    private http: HttpClient
  ) {
    this.http.get('https://dinoparks.net/nudls/feed').subscribe((feed: Array<any>) => {
      feed.forEach(event => {
        switch (event.kind){
          case (EventKind.dino_added): {
            let dino: Dino = {
              id: event.id,
              name: event.name,
              species: event.species,
              gender: event.gender,
              digestionPeriod: event.digestion_period_in_hours,
              isHerbivore: event.herbivore,
              timeAdded: event.time,
              parkId: event.park_id
            }
            this.dinos.push(dino);
            break;
          }
          case (EventKind.dino_removed): {
            let dino = this.dinos.find(x => x.id == event.id);
            if (event.time > dino.timeAdded) {
              this._removeDino(dino)
            }
            break;
          }
          case (EventKind.dino_location_updated): {
            let oldLocation = this.dinoLocations.find(x => x.dinoId == event.dinosaur_id);
            if (oldLocation && oldLocation.time < event.time) {
              this._removeDinoLocation(oldLocation)
            }

            let newLocation: DinoLocation = {
              dinoId: event.dinosaur_id,
              locationId: event.location,
              time: event.time
            }
            this.dinoLocations.push(newLocation);
            break;
          }
          case (EventKind.dino_fed): {
            let dino = this.dinos.find(x => x.id == event.id);
            if (dino.timeLastFed == null || dino.timeLastFed < event.time) {
              dino.timeLastFed = event.time
            }
            break;
          }
          case (EventKind.maintainence_performed): {
            let maintainance: Maintainance = {
              locationId: event.location,
              time: event.time
            }
            this.maintainances.push(maintainance);
            break;
          }
          default: {
            return;
          }
        }
      });
    })

    console.log(this.dinos);
    console.log(this.dinoLocations);
    console.log(this.maintainances);
  }

  getDinos() {
    return this.dinos;
  }

  getDinoLocations() {
    return this.dinoLocations;
  }

  getMaintainances() {
    return this.maintainances;
  }

  private _removeDino(dino: Dino) {
    var index = this.dinos.indexOf(dino);
      if (index > -1) {
        this.dinos.splice(index, 1);
      }
  }

  private _removeDinoLocation(dinoLocation: DinoLocation) {
    var index = this.dinoLocations.indexOf(dinoLocation);
      if (index > -1) {
        this.dinoLocations.splice(index, 1);
      }
  }

}
