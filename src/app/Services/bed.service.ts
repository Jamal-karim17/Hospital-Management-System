import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PatientsService } from './patients.service';
import { RoomService } from './room.service';

@Injectable({
  providedIn: 'root'
})
export class BedService {
  private storageKey = 'beds';  // The key under which beds will be stored in localStorage
  private bedsSubject = new BehaviorSubject<any[]>(this.getAllBeds()); // Subject to emit bed changes

  constructor(
    private patientsService: PatientsService, // Inject PatientService
    private roomService: RoomService // Inject RoomService
  ) { }

  // Fetch all beds (retrieve from localStorage)
  getAllBeds(): { 
    id: number; 
    name: string; 
    roomType: string; 
    room: any; 
    status: string; 
    patient: any; 
  }[] {
    const beds = localStorage.getItem(this.storageKey);
    if (beds) {
      return JSON.parse(beds); // Parse and return the stored bed data
    }
    return []; // Return empty array if no beds are found
  }

  // Save the beds to localStorage
  private saveBedsToLocalStorage(beds: { 
    id: number; 
    name: string; 
    roomType: string; 
    room: any; 
    status: string; 
    patient: any; 
  }[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(beds)); // Save the updated beds array to localStorage
    this.bedsSubject.next(beds); // Emit updated beds to subscribers
  }

  // Add a new bed
  addBed(bed: { 
    id: number; 
    name: string; 
    roomType: string; 
    room: any; 
    status: string; 
    patient: any; 
  }): void {
    const beds = this.getAllBeds(); // Retrieve current beds from localStorage
    beds.push(bed); // Add new bed to the list
    this.saveBedsToLocalStorage(beds); // Save updated list to localStorage
    this.updateRoomStatus(bed.room); // Update room status after adding a new bed
  }

  // Edit an existing bed
  editBed(id: number, updatedBed: { 
    name?: string; 
    roomType?: string; 
    room?: any; 
    status?: string; 
    patient?: any; 
  }): void {
    const beds = this.getAllBeds(); // Retrieve current beds from localStorage
    const index = beds.findIndex(b => b.id === id);
    if (index !== -1) {
      beds[index] = { ...beds[index], ...updatedBed };
      this.saveBedsToLocalStorage(beds); // Save updated list to localStorage
      if (updatedBed.room) {
        this.updateRoomStatus(updatedBed.room); // Update room status after bed edit
      }
    }
  }

  // Delete a bed by ID
  deleteBed(id: number): void {
    let beds = this.getAllBeds(); // Retrieve current beds from localStorage
    const bed = beds.find(b => b.id === id);
    if (bed) {
      this.updateRoomStatus(bed.room); // Update room status when a bed is deleted
    }
    beds = beds.filter(b => b.id !== id); // Remove the bed with the specified ID
    this.saveBedsToLocalStorage(beds); // Save updated list to localStorage
  }

  // Assign a patient to a bed
  assignPatientToBed(bedId: number, patientId: string): void {
    const beds = this.getAllBeds(); // Retrieve current beds from localStorage
    const bedIndex = beds.findIndex(b => b.id === bedId);
    if (bedIndex !== -1) {
      const patient = this.patientsService.getPatientById(patientId); // Fetch patient by ID from PatientService
      if (patient) {
        beds[bedIndex].patient = patient; // Assign the patient to the bed
        beds[bedIndex].status = 'Occupied'; // Change status to 'Occupied'
        this.saveBedsToLocalStorage(beds); // Save updated list to localStorage
        this.updateRoomStatus(beds[bedIndex].room); // Update room status after assigning patient
      }
    }
  }

  // Remove a patient from a bed
  removePatientFromBed(bedId: number): void {
    const beds = this.getAllBeds(); // Retrieve current beds from localStorage
    const bedIndex = beds.findIndex(b => b.id === bedId);
    if (bedIndex !== -1) {
      beds[bedIndex].patient = null; // Remove the patient from the bed
      beds[bedIndex].status = 'Available'; // Change status to 'Available'
      this.saveBedsToLocalStorage(beds); // Save updated list to localStorage
      this.updateRoomStatus(beds[bedIndex].room); // Update room status after removing patient
    }
  }

  // Update room status (Occupied/Available) based on the bed statuses
  private updateRoomStatus(roomName: string): void {
    const rooms = this.roomService.getRooms(); // Get all rooms from RoomService
    const room = rooms.find(r => r.name === roomName); // Find the room by name
    if (room) {
      // Update available and occupied beds count
      const availableBeds = this.getAllBeds().filter(b => b.room === roomName && b.status === 'Available').length;
      const occupiedBeds = room.capacity - availableBeds;
      
      // Update room status
      const updatedRoom = {
        ...room,
        availableBeds: availableBeds,
        occupiedBeds: occupiedBeds
      };
      this.roomService.updateRoom(room.id, updatedRoom); // Update the room with new bed status
    }
  }

  // Update a bed (this is the new method)
  updateBed(bed: any): void {
    const beds = this.getAllBeds(); // Retrieve current beds from localStorage
    const index = beds.findIndex(existingBed => existingBed.id === bed.id);
    if (index !== -1) {
      beds[index] = { ...beds[index], ...bed }; // Update the bed with the new information
      this.saveBedsToLocalStorage(beds); // Save updated list to localStorage
      if (bed.room) {
        this.updateRoomStatus(bed.room); // Update room status if the room has changed
      }
    }
  }

  // Filter out occupied beds when selecting beds
  getAvailableBedsForSelection(roomName: string): { 
    id: number; 
    name: string; 
    status: string; 
    patient: any; 
  }[] {
    return this.getAllBeds().filter(b => b.room === roomName && b.status === 'Available');
  }

  // Update bed status (Available/Occupied)
  updateBedStatus(bedId: number, newStatus: string): void {
    const beds = this.getAllBeds();
    const bedIndex = beds.findIndex(b => b.id === bedId);
    if (bedIndex !== -1) {
      beds[bedIndex].status = newStatus;  // Update the bed status
      this.saveBedsToLocalStorage(beds);  // Save the updated beds list
  
      // After updating the bed status, call RoomService to update the room status
      this.updateRoomStatus(beds[bedIndex].room);  // Update the room's available/occupied count
    }
  }

  // Observable to subscribe to bed updates
  get beds$() {
    return this.bedsSubject.asObservable();
  }
}
