import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../components/sidebar/sidebar';

@Component({
  selector: 'app-layout-employee',
  imports: [Sidebar,RouterOutlet],
  templateUrl: './layout-employee.html',
  styleUrl: './layout-employee.css',
})
export class LayoutEmployee {

}
