import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ApiService } from '../service/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-roomsearch',
  imports: [CommonModule, FormsModule],
  templateUrl: './roomsearch.component.html',
  styleUrl: './roomsearch.component.css'
})
export class RoomsearchComponent implements OnInit {
  @Output() searchResults = new EventEmitter<any[]>();

  startDate: string | null = null;
  endDate: string | null = null;
  roomType: string = '';
  roomTypes: string[] = [];
  error: any = null;

  minDate: string = new Date().toISOString().split('T')[0];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.fetchRoomTypes();
  }

  fetchRoomTypes(): void {
    this.apiService.getRoomTypes().subscribe({
      next: (types) => {
        this.roomTypes = types;
      },
      error: (err:any) => {
        this.showError(err?.error?.message || 'Error fetching room types: ' + err);
        console.error(err);
      }
    });
  }

  showError(msg: string): void {
    this.error = msg;
    setTimeout(() => {
      this.error = null;
    }, 5000);
  }

  handleSearch(): void {
    if (!this.startDate || !this.endDate || !this.roomType) {
      this.showError('Please fill in all required fields.');
      return;
    }

    // Convert startDate and endDate from string to Date objects
    const formattedStartDate = new Date(this.startDate);
    const formattedEndDate = new Date(this.endDate);

    // Check if the dates are valid
    if (isNaN(formattedStartDate.getTime()) || isNaN(formattedEndDate.getTime())) {
      this.showError('Please enter valid dates.');
      return;
    }

    // Convert the Date objects to 'yyyy-MM-dd' format
    const startDateStr = formattedStartDate.toLocaleDateString('en-CA'); // 'en-CA' locale gives 'yyyy-MM-dd' format
    const endDateStr = formattedEndDate.toLocaleDateString('en-CA'); // 'en-CA' locale gives 'yyyy-MM-dd' format

    console.log('formattedStartDate:', startDateStr);
    console.log('formattedEndDate:', endDateStr);
    console.log('roomType:', this.roomType);

    this.apiService.getAvailableRooms(startDateStr, endDateStr, this.roomType)
    .subscribe({
      next: (resp: any) => {
        if (resp.rooms.length === 0) {
          this.showError('Room type not currently available for the selected date');
        return;
      }
      this.searchResults.emit(resp.rooms);
      this.error = '';
    },
    error: (err:any) => {
      this.showError(err?.error?.message || 'Error fetching available rooms: ' + err);
      console.error(err);
    },
    });
  }
}
