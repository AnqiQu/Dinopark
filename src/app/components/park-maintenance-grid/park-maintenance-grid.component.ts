import { Component, Inject, OnInit } from '@angular/core';
import { DinoLocation } from '../../interfaces/dino-location.interface';
import { Dino } from '../../interfaces/dino.interface';
import { Maintenance } from '../../interfaces/maintenance.interface';
import { NudlsApiService } from '../../services/nudls-api.service';

@Component({
  selector: 'park-maintenance-grid',
  templateUrl: './park-maintenance-grid.component.html',
  styleUrls: ['./park-maintenance-grid.component.scss']
})

export class ParkMaintenanceGridComponent implements OnInit {

    dinos: Dino[];
    dinoLocations: DinoLocation[];
    maintenances: Maintenance[];

  constructor(
    @Inject(NudlsApiService) protected nudlsApiService: NudlsApiService,
  ) {
  }

  ngOnInit() {
    this.dinos = this.nudlsApiService.getDinos();
    this.dinoLocations = this.nudlsApiService.getDinoLocations();
    this.maintenances = this.nudlsApiService.getMaintenances();
  }
}
