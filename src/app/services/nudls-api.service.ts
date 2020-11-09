import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Dino } from '../interfaces/dino.interface';
import { DinoLocation } from '../interfaces/dino-location.interface';
import { Maintenance } from '../interfaces/maintenance.interface';
import { EventKind } from '../enums/event-kind';
import { ApiOutputData } from '../interfaces/api-output-data.interface';
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
    // Calls the NUDLS endpoint to get the data for the dinosaurs and park 
    this.http.get<any>('https://dinoparks.net/nudls/feed').subscribe((feed: Array<any>) => {
      // The events are sorted in ascending order chronologically.
      // This ensures the feed is logical, for instance a dinosaur will not be removed before it is added
      feed.sort((a, b) => +(new Date(a.time)) - +(new Date(b.time)));

      // The events are then processed and mapped accordingly
      feed.forEach(event => {
        switch (event.kind) {
          case (EventKind.DinoAdded): { // A dinosaur object is created and added to the dinosaur list when a dinosaur is added to the park
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
            let dino = this.dinos.find(x => x.id == event.dinosaur_id); // A dinosaur is removed from the dinosaur list when a dinosaur is removed from the park
            if (new Date(event.time) > dino.timeAdded) { // Validation to make sure the dinosaur is removed after it is added
              this._removeDino(dino)
            }
            break;
          }
          case (EventKind.DinoLocationUpdated): {
            let oldLocation = this.dinoLocations.find(x => x.dinoId == event.dinosaur_id);
            if (oldLocation && oldLocation.time < new Date(event.time)) {
              this._removeDinoLocation(oldLocation) // Removes the dinosaur's old location from the locations list when a dinosaur moves
            }

            let newLocation: DinoLocation = {
              dinoId: event.dinosaur_id,
              locationId: event.location,
              time: new Date(event.time)
            }
            this.dinoLocations.push(newLocation); // The dinosaur's new location is added to the locations list 
            break;
          }
          case (EventKind.DinoFed): {
            let dino = this.dinos.find(x => x.id == event.dinosaur_id);
            if (dino.timeLastFed == null || dino.timeLastFed < new Date(event.time)) {
              dino.timeLastFed = new Date(event.time) // Updates the latest time that a dinosaur was fed 
            }
            break;
          }
          case (EventKind.MaintenancePerformed): {
            let maintenance: Maintenance = { // Creates a maintenance object and adds it to the list of maintenances 
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

      // The lists of dinosaurs, dinosaur locations and maintenances are then returned 
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
