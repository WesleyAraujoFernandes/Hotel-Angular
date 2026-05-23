import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ApiService } from '../service/api.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-roomresult',
  imports: [CommonModule],
  templateUrl: './roomresult.component.html',
  styleUrl: './roomresult.component.css'
})
export class RoomresultComponent {
  @Input() roomSearchResults: any[]=[];
  isAdmin: boolean = false;

  constructor(private router: Router, private apiService: ApiService) {
    this.isAdmin = this.apiService.isAdmin();
  }

  navigateToEditRoom(roomId: number) {
    this.router.navigate([`/admin/edit-room/${roomId}`]);
  }

  navigateToRoomDetails(roomId: number) {
    this.router.navigate([`/room-details/${roomId}`]);
  }
}
