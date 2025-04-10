import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomService, Room } from 'src/app/Services/room.service';

@Component({
  selector: 'app-add-edit-room',
  templateUrl: './add-edit-room.component.html',
  styleUrls: ['./add-edit-room.component.css'],
})
export class AddEditRoomComponent implements OnInit {
  @Input() editingRoom: Room | null = null;
  @Output() saved = new EventEmitter<void>();

  roomId: number | null = null;
  name: string = '';
  type: string = 'Ward 1';
  capacity: number = 1;

  roomTypes: string[] = [
    'Ward 1', 'Ward 2', 'Ward 3', 'Ward 4', 'Ward 5', 'Ward 6',
    'Ward 7', 'Ward 8', 'Ward 9', 'Ward 10', 'Ward 11',
    'ICU', 'Private', 'Emergency'
  ];

  constructor(
    private route: ActivatedRoute,
    private roomService: RoomService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // If the component is passed editingRoom through @Input(), use that data
    if (this.editingRoom) {
      this.name = this.editingRoom.name;
      this.type = this.editingRoom.type;
      this.capacity = this.editingRoom.capacity;
    } else {
      // Otherwise, try to fetch the room details via query parameters (for editing purposes)
      this.route.queryParams.subscribe(params => {
        this.roomId = +params['roomId'];
        if (this.roomId) {
          // Fetch the room data from the service using roomId
          const existingRoom = this.roomService.getRooms().find(room => room.id === this.roomId);
          if (existingRoom) {
            this.name = existingRoom.name;
            this.type = existingRoom.type;
            this.capacity = existingRoom.capacity;
          }
        }
      });
    }
  }

  saveRoom(): void {
    if (this.roomId || this.editingRoom) {
      // If roomId exists or editingRoom is passed, update the room
      const roomToUpdate = { name: this.name, type: this.type, capacity: this.capacity };
      if (this.roomId) {
        this.roomService.updateRoom(this.roomId, roomToUpdate);
      } else if (this.editingRoom) {
        this.roomService.updateRoom(this.editingRoom.id, roomToUpdate);
      }
    } else {
      // If no roomId or editingRoom is passed, add a new room
      this.roomService.addRoom({
        name: this.name,
        type: this.type,
        capacity: this.capacity
      });
    }

    this.resetForm();
    this.saved.emit();
  }

  resetForm(): void {
    this.name = '';
    this.type = 'Ward 1';
    this.capacity = 1;
    this.editingRoom = null;
    this.roomId = null;
  }
}
