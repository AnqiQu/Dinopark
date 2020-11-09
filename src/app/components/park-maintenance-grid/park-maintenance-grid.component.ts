import { Component, Inject, OnInit } from '@angular/core';
import { DinoLocation } from '../../interfaces/dino-location.interface';
import { Dino } from '../../interfaces/dino.interface';
import { Maintenance } from '../../interfaces/maintenance.interface';
import { GridTile } from '../../interfaces/grid-tile.interface';
import { NudlsApiService } from '../../services/nudls-api.service';
import { AlphabetLetter } from '../../enums/alphabet-letter';

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

  constructor(
    @Inject(NudlsApiService) protected nudlsApiService: NudlsApiService,
  ) {
  }

  ngOnInit() {
    this.dinos = this.nudlsApiService.getDinos();
    this.dinoLocations = this.nudlsApiService.getDinoLocations();
    this.maintenances = this.nudlsApiService.getMaintenances();

    for (var i = 0; i < 16; i++) {
      for (let letter in AlphabetLetter) {
        let letterIndex = parseInt(AlphabetLetter[letter]);
        let tile: GridTile = {
          id: letter + (i + 1).toString(),
          column: i,
          row: letterIndex,
        }
        this.grid[i][letterIndex] = tile;
      }
    }
  }
}
