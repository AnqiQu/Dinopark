import { Component, Inject } from '@angular/core';
import { NudlsApiService } from './services/nudls-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Dinopark';

  constructor(
    @Inject(NudlsApiService) protected nudlsApiService: NudlsApiService,
  ) {
    
  }

  
}
