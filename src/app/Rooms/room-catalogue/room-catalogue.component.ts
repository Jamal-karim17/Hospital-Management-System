import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { RoomService } from 'src/app/Services/room.service';
import { BedService } from 'src/app/Services/bed.service';  // Import BedService
import { Subscription } from 'rxjs';  // To handle subscription cleanup

@Component({
  selector: 'app-room-catalogue',
  templateUrl: './room-catalogue.component.html',
  styleUrls: ['./room-catalogue.component.css'],
})
export class RoomCatalogueComponent implements OnInit, OnDestroy {
  rooms: any[] = [];
  private bedsSubscription: Subscription = new Subscription(); // To hold the subscription

  constructor(
    private roomService: RoomService,
    private bedService: BedService,  // Inject BedService
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRooms();  // Load rooms initially
    this.subscribeToBeds();  // Subscribe to bed updates
  }

  ngOnDestroy(): void {
    this.bedsSubscription.unsubscribe();  // Clean up the subscription on component destroy
  }

  // Subscribe to the bed changes and update room data accordingly
  subscribeToBeds(): void {
    this.bedsSubscription = this.bedService.beds$.subscribe(() => {
      this.loadRooms();  // Reload rooms every time bed data changes
    });
  }

  loadRooms(): void {
    const rawRooms = this.roomService.getRooms();
    this.rooms = rawRooms.map((room) => {
      // Get all beds from BedService and filter by room name
      const bedsInRoom = this.bedService.getAllBeds().filter(b => b.room === room.name);

      // Calculate available and occupied bed counts
      const availableBeds = bedsInRoom.filter(b => b.status === 'Available').length;
      const occupiedBeds = bedsInRoom.filter(b => b.status === 'Occupied').length;

      return {
        ...room,
        available: availableBeds,
        occupied: occupiedBeds
      };
    });
  }

  // Edit a room - navigate to the Add/Edit Room page with the room details
  editRoom(index: number): void {
    const room = this.rooms[index];
    this.router.navigate(['/roommanagement'], { queryParams: { roomId: room.id } });
  }

  // Delete a room from the catalogue
  deleteRoom(index: number): void {
    const roomId = this.rooms[index].id;
    this.roomService.deleteRoom(roomId);
    this.loadRooms();
  }

  // Method to update the room counts manually when the bed status changes
  updateRoomStatusAfterBedChange(): void {
    this.loadRooms();  // Reload the room data and update counts
  }

  // Example of how to trigger this after changing a bed's status
  onBedStatusChange(bedId: number, newStatus: string): void {
    this.bedService.updateBedStatus(bedId, newStatus);  // Update bed status
    this.updateRoomStatusAfterBedChange();  // Recalculate room status
  }
}
