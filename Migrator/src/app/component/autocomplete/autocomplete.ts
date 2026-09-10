import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  imports: [],
  standalone: true,
  selector: 'app-autocomplete',
  styleUrl: './autocomplete.css',
  templateUrl: './autocomplete.html',
})
export class Autocomplete {

  suggestions: string[] = [];

  constructor(private http: HttpClient) { }

  search(term: string) {
    this.http
      .get<string[]>(`https://localhost:8080/search?query=${term}`)
      .subscribe(data => {
        console.log("Response: ", data);

        this.suggestions = data;
      })
  }

}
