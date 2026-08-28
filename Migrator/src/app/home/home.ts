import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MigrationComponent } from './migration-component/migration-component';

@Component({
  imports: [MigrationComponent],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {
  locations = [1];

  constructor(private http: HttpClient) {}

  addLocation() {
    this.locations.push(this.locations.length + 1);
  }

  sendRequest() {
    const body = {
      locationCode: 'LOC001',
    };

    this.http.post(
      'http://localhost:3000/api/location',
      body
    ).subscribe(
      response => {
        console.log('Request successful:', response);
      }
    )
  }
}
