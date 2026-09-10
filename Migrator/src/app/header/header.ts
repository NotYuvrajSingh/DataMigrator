import { Component } from '@angular/core';
import { Autocomplete } from '../component/autocomplete/autocomplete';

@Component({
  imports: [Autocomplete],
  selector: 'app-header',
  standalone: true,
  styleUrl: './header.css',
  templateUrl: './header.html',
})
export class Header {}
