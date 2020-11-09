import { Component, Inject, OnInit } from '@angular/core';
import { DinoLocation } from '../../interfaces/dino-location.interface';
import { Dino } from '../../interfaces/dino.interface';
import { Maintenance } from '../../interfaces/maintenance.interface';
import { GridTile } from '../../interfaces/grid-tile.interface';
import { NudlsApiService } from '../../services/nudls-api.service';
import { AlphabetLetter } from '../../enums/alphabet-letter';
import { ZoneStatus } from '../../enums/zone-status';
import * as moment from 'moment';

@Component({
  selector: 'park-maintenance-grid',
  templateUrl: './park-maintenance-grid.component.html',
  styleUrls: ['./park-maintenance-grid.component.scss']
})

export class ParkMaintenanceGridComponent implements OnInit {

  dinos: Dino[];
  dinoLocations: DinoLocation[];
  maintenances: Maintenance[];

  // Our grid is a 2D array of GridTiles, measuring 16 X 26 tiles 
  grid: GridTile[][] = Array.from(Array(16), () => new Array(26));
  AlphabetLetters = AlphabetLetter;
  dateNow = new Date();
  maintenanceImage = '../../../assets/dino-parks-wrench.png';
  loading = true;

  constructor(
    @Inject(NudlsApiService) protected nudlsApiService: NudlsApiService,
  ) {
  }

  ngOnInit(): void {
    // Getting the data for the monitoring sustem from the NUDLS API service
    this.nudlsApiService.getData().subscribe(result => {
      this.dinos = result.dinos;
      this.dinoLocations = result.dinoLocations;
      this.maintenances = result.maintenances;

      // Once the data has been loaded, the UI can show the table instead of the loading bar
      this.loading = false;
    });

    // Populating the id field of each GridTile in our grid array
    // This correcponds to the row number and column letter
    for (var i = 0; i < 16; i++) {
      for (let letter in AlphabetLetter) {
        let letterIndex = parseInt(AlphabetLetter[letter]);
        let tile: GridTile = {
          id: letter + (i + 1).toString(),
        }
        this.grid[i][letterIndex] = tile;
      }
    }
  }

  formatDateForHeading(date: Date): string {
    return moment(date).format('D MMMM YYYY');
  }

  // Gets the safety status of each tile.
  // A tile is safe if all the dinosaurs there are herbivores or if all carnivores are still digesting their last meal.
  // A tile status is unknown if there have been no dinosaurs added 
  getStatus(tile: GridTile): ZoneStatus {
    if (!this._containsDino(tile)) {
      return ZoneStatus.Unknown;
    }
    let dinos = this._getDinosInZone(tile);
    if (dinos.every(a => a.isHerbivore || this._isDigestingMeal(a))) {
      return ZoneStatus.Safe;
    }
    return ZoneStatus.Unsafe;
  }

  getTileColor(tile: GridTile): string {
    switch (this.getStatus(tile)) {
      case (ZoneStatus.Safe): {
        return 'green';
      }
      case (ZoneStatus.Unsafe): {
        return 'red';
      }
      default: {
        return '';
      }
    }
  }

  needsMaintenance(tile: GridTile): boolean {
    let tileMaintenances = this.maintenances?.filter(a => a.locationId == tile.id);
    // If a tile hasn't been maintained before, it is ignored
    if (!tileMaintenances || tileMaintenances.length == 0) {
      return false;
    }

    // Sorts the past maintenances in descending order.
    // This helps us find the latest maintenance date if a tile has been maintained multiple times
    tileMaintenances.sort((a, b) => +b.time - +a.time);
    return this._getDifferenceInDays(this.dateNow, tileMaintenances[0].time) > 30; // A maintainance is needed if it was last maintained more then 30 days ago
  }

  getTooltip(tile: GridTile): string {
    let tooltip = "";
    if (this.needsMaintenance(tile)) {
      tooltip += "Needs maintenance "
    }
    if (this.getStatus(tile) == ZoneStatus.Safe) {
      tooltip += "(Safe)"
    }
    if (this.getStatus(tile) == ZoneStatus.Unsafe) {
      tooltip += "(Unsafe)"
    }
    return tooltip;
  }

  // Finds if there is a dinosaur on a given tile
  private _containsDino(tile: GridTile): boolean {
    return this.dinoLocations?.some(a => a.locationId == tile.id);
  }

  // Gets the dinosaur/s on a given tile
  private _getDinosInZone(tile: GridTile): Dino[] { // Returns an array in case there is more than one dinosaur on a single tile
    let dinoIds = this.dinoLocations.filter(a => a.locationId == tile.id).map(x => x.dinoId);
    return this.dinos.filter(a => dinoIds.some(x => x == a.id));
  }

  private _isDigestingMeal(dino: Dino): boolean {
    if (dino.timeLastFed) {
      return this._getDifferenceInHours(this.dateNow, dino.timeLastFed) < dino.digestionPeriod;
    }
    return false;
  }

  private _getDifferenceInDays(laterDate: Date, earlierDate: Date): number {
    let date1 = moment(laterDate);
    let date2 = moment(earlierDate);

    return date1.diff(date2, 'days')
  }

  private _getDifferenceInHours(laterDate: Date, earlierDate: Date): number {
    let date1 = moment(laterDate);
    let date2 = moment(earlierDate);

    return date1.diff(date2, 'hours')
  }
}
