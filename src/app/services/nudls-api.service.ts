import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Dino } from '../interfaces/dino.interface';
import { DinoLocation } from '../interfaces/dino-location.interface';
import { Maintenance } from '../interfaces/maintenance.interface';
import { EventKind } from '../enums/event-kind';
import { ApiOutputData } from '../interfaces/api-output-data.interface';
import { tap } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NudlsApiService {

  dinos: Dino[] = [];
  dinoLocations: DinoLocation[] = [];
  maintenances: Maintenance[] = [];

  constructor(
    private http: HttpClient
  ) {
  }

  getData(): Observable<ApiOutputData> {
    var subject = new Subject<ApiOutputData>();
    this.http.get<any>('https://dinoparks.net/nudls/feed').subscribe((feed: Array<any>) => {
      feed.sort((a, b) => +(new Date(a.time)) - +(new Date(b.time)));
      feed.forEach(event => {
        switch (event.kind){
          case (EventKind.DinoAdded): {
            let dino: Dino = {
              id: event.id,
              name: event.name,
              species: event.species,
              gender: event.gender,
              digestionPeriod: event.digestion_period_in_hours,
              isHerbivore: event.herbivore,
              timeAdded: new Date(event.time),
              parkId: event.park_id
            }
            this.dinos.push(dino);
            break;
          }
          case (EventKind.DinoRemoved): {
            let dino = this.dinos.find(x => x.id == event.dinosaur_id);
            if (new Date(event.time) > dino.timeAdded) {
              this._removeDino(dino)
            }
            break;
          }
          case (EventKind.DinoLocationUpdated): {
            let oldLocation = this.dinoLocations.find(x => x.dinoId == event.dinosaur_id);
            if (oldLocation && oldLocation.time < new Date(event.time)) {
              this._removeDinoLocation(oldLocation)
            }

            let newLocation: DinoLocation = {
              dinoId: event.dinosaur_id,
              locationId: event.location,
              time: new Date(event.time)
            }
            this.dinoLocations.push(newLocation);
            break;
          }
          case (EventKind.DinoFed): {
            let dino = this.dinos.find(x => x.id == event.dinosaur_id);
            if (dino.timeLastFed == null || dino.timeLastFed < new Date(event.time)) {
              dino.timeLastFed = new Date(event.time)
            }
            break;
          }
          case (EventKind.MaintenancePerformed): {
            let maintenance: Maintenance = {
              locationId: event.location,
              time: new Date(event.time)
            }
            this.maintenances.push(maintenance);
            break;
          }
          default: {
            return;
          }
        }
      });

      subject.next({
        dinos: this.dinos,
        dinoLocations: this.dinoLocations,
        maintenances: this.maintenances
      } as ApiOutputData);

      });
      return subject.asObservable();
  }

  private _removeDino(dino: Dino) {
    var index = this.dinos.indexOf(dino);
      if (index > -1) {
        this.dinos.splice(index, 1);
        let locationIndex = this.dinoLocations.findIndex(x => x.dinoId == dino.id);
        if (locationIndex > -1) {
          this.dinoLocations.splice(locationIndex, 1);
        }
      }
  }

  private _removeDinoLocation(dinoLocation: DinoLocation) {
    var index = this.dinoLocations.indexOf(dinoLocation);
      if (index > -1) {
        this.dinoLocations.splice(index, 1);
      }
  }

}
