import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface Bed {
  id: number;
  status: 'Available' | 'Occupied';
}

export interface Room {
  id: number;
  name: string;
  type: string;
  capacity: number;
  beds: Bed[];
}

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private storageKey = 'hospitalRooms';
  private roomsSubject = new BehaviorSubject<Room[]>([]); // BehaviorSubject for rooms
  rooms$ = this.roomsSubject.asObservable(); // Observable for rooms

  private roomTypes: string[] = [
    'Ward 1', 'Ward 2', 'Ward 3', 'Ward 4', 'Ward 5', 'Ward 6',
    'Ward 7', 'Ward 8', 'Ward 9', 'Ward 10', 'Ward 11',
    'ICU', 'Private', 'Emergency'
  ];

  constructor() {
    this.loadRooms();
  }

  private loadRooms() {
    const data = localStorage.getItem(this.storageKey);
    const rooms = data ? JSON.parse(data) : [];
    this.roomsSubject.next(rooms); // Emit the rooms data
  }

  private saveRooms() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.roomsSubject.value));
  }

  getRooms(): Room[] {
    return this.roomsSubject.value;
  }

  getRoomTypes(): string[] {
    return this.roomTypes;
  }

  addRoom(room: Omit<Room, 'id' | 'beds'>) {
    const newRoom: Room = {
      id: Date.now(),
      ...room,
      beds: Array.from({ length: room.capacity }, (_, i) => ({
        id: i + 1,
        status: 'Available'
      }))
    };
    this.roomsSubject.next([...this.roomsSubject.value, newRoom]); // Emit new rooms list
    this.saveRooms();
  }

  updateRoom(id: number, updatedRoom: Partial<Room>) {
    const rooms = this.roomsSubject.value;
    const index = rooms.findIndex(r => r.id === id);
    if (index > -1) {
      const existing = rooms[index];
      if (updatedRoom.capacity && updatedRoom.capacity !== existing.capacity) {
        existing.beds = Array.from({ length: updatedRoom.capacity }, (_, i) => ({
          id: i + 1,
          status: existing.beds[i]?.status || 'Available'
        }));
      }
      rooms[index] = { ...existing, ...updatedRoom };
      this.roomsSubject.next([...rooms]); // Emit updated rooms list
      this.saveRooms();
    }
  }

  deleteRoom(id: number) {
    const rooms = this.roomsSubject.value.filter(r => r.id !== id);
    this.roomsSubject.next(rooms); // Emit updated rooms list
    this.saveRooms();
  }

  getRoomById(id: number): Room | undefined {
    return this.roomsSubject.value.find(room => room.id === id);
  }
}
