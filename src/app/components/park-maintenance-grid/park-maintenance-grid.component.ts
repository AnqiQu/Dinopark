import { Component, Inject, OnInit } from '@angular/core';
import { DinoLocation } from '../../interfaces/dino-location.interface';
import { Dino } from '../../interfaces/dino.interface';
import { Maintenance } from '../../interfaces/maintenance.interface';
import { GridTile } from '../../interfaces/grid-tile.interface';
import { NudlsApiService } from '../../services/nudls-api.service';
import { AlphabetLetter } from '../../enums/alphabet-letter';
import { ZoneStatus } from '../../enums/zone-status';
import * as moment from 'moment';
import { ApiOutputData } from 'src/app/interfaces/api-output-data.interface';

@Component({
  selector: 'park-maintenance-grid',
  templateUrl: './park-maintenance-grid.component.html',
  styleUrls: ['./park-maintenance-grid.component.scss']
})

export class ParkMaintenanceGridComponent implements OnInit {

    dinos: Dino[];
    dinoLocations: DinoLocation[];
    maintenances: Maintenance[];

    grid: GridTile[][] = Array.from(Array(16), () => new Array(26));
    AlphabetLetters = AlphabetLetter;
    dateNow = new Date();

  constructor(
    @Inject(NudlsApiService) protected nudlsApiService: NudlsApiService,
  ) {
  }

  ngOnInit(): void {
    this.nudlsApiService.getData().subscribe(result => {
      this.dinos = result.dinos;
      this.dinoLocations = result.dinoLocations;
      this.maintenances = result.maintenances;
    });

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

  getStatus(tile: GridTile): ZoneStatus {
    if (!this._containsDino(tile)) {
      return ZoneStatus.Unknown;
    }
    let dino = this._getDinoInZone(tile);
    if (dino.isHerbivore || this._isDigestingMeal(dino)) {
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

  private _containsDino(tile: GridTile): boolean {
    return this.dinoLocations.some(a => a.locationId == tile.id);
  }

  private _getDinoInZone(tile: GridTile): Dino {
    let dinoId = this.dinoLocations.find(a => a.locationId == tile.id).dinoId;
    return this.dinos.find(a => a.id == dinoId);
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
