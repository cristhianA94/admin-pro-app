import { Component } from '@angular/core';
import { SettingsService } from './services/settings/settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'admin-pro';

  // Lamma al constructor del LocalStorage
  constructor(public _ajustes: SettingsService) {

  }
}
