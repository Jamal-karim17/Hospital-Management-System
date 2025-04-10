import { Component, OnInit } from '@angular/core';
import { BedService } from 'src/app/Services/bed.service';
import { PatientsService } from 'src/app/Services/patients.service';
import { RoomService } from 'src/app/Services/room.service'; // Assuming you have a room service

@Component({
  selector: 'app-bed-catalogue',
  templateUrl: './bed-catalogue.component.html',
  styleUrls: ['./bed-catalogue.component.css']
})
export class BedCatalogueComponent implements OnInit {
  beds: { 
    id: number; 
    name: string; 
    roomType: string; 
    room: any; 
    status: string; 
    patient: any; 
  }[] = [];

  filteredBeds: { id: number; name: string; roomType: string; room: any; status: string; patient: any }[] = [];
  searchQuery: string = '';
  
  // New bed object
  newBed: { 
    id?: number;
    name: string;
    roomType: string;
    room: any;
    status: string;
    patient: any;
  } = {
    id: undefined, // Initialize the id as undefined for new beds
    name: '', // Default to empty string
    roomType: 'Standard', // Default to 'Standard'
    room: null, // Default to null (no room selected)
    status: 'Available', // Default to 'Available' status
    patient: null // Default to null (no patient assigned)
  };

  patients: any[] = [];
  selectedPatientId: number | null = 1;
  showModal: boolean = false; 
  rooms: any[] = []; // Rooms list from the RoomService
  roomTypes: string[] = []; // Room types (e.g., 'ICU', 'Standard')
  selectedPatient: any = null; // Store selected patient
  selectedRoom: any = null; // Track selected room for filtering
  bedNames: string[] = []; // List of bed names (e.g., 'Bed 1', 'Bed 2', ...)

  constructor(
    private bedService: BedService,
    private patientsService: PatientsService,
    private roomService: RoomService // Room service to fetch room data
  ) {}

  ngOnInit(): void {
    this.loadBeds();
    this.loadPatients();
    this.loadRooms();
    this.extractRoomTypes(); // Extract room types dynamically
    this.generateBedNames(); // Generate bed names based on room capacity
  }

  loadBeds(): void {
    this.beds = this.bedService.getAllBeds();
    this.filteredBeds = [...this.beds]; // Initialize filtered beds with all beds
    console.log('Loaded Beds:', this.beds);
  }

  loadPatients(): void {
    this.patients = this.patientsService.getPatients();
    console.log('Loaded Patients:', this.patients);
  }

  loadRooms(): void {
    this.rooms = this.roomService.getRooms(); // Fetch rooms
    console.log('Loaded Rooms:', this.rooms);
  }

  extractRoomTypes(): void {
    const fetchedRoomTypes = this.roomService.getRoomTypes(); // Fetch predefined room types
    this.roomTypes = Array.from(new Set(fetchedRoomTypes)); // Remove duplicates
    console.log('Available Room Types:', this.roomTypes);
  }

  generateBedNames(): void {
    if (this.newBed.room && this.newBed.room.capacity) {
      this.bedNames = Array.from({ length: this.newBed.room.capacity }, (_, i) => `Bed ${i + 1}`);
    }
  }

  filterBeds(): void {
    if (this.searchQuery) {
      this.filteredBeds = this.beds.filter(bed =>
        bed.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        bed.roomType.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        (bed.room?.name || '').toLowerCase().includes(this.searchQuery.toLowerCase()) || 
        (bed.patient?.name || '').toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.filteredBeds = [...this.beds]; // Reset to all beds if no search query
    }
  }

  addNewBed(): void {
    this.newBed = {
      name: '',
      roomType: 'Standard',
      room: null,
      status: 'Available',
      patient: null
    };
  }

  saveNewBed(): void {
    if (this.newBed.id) {
      this.bedService.updateBed(this.newBed); // Update existing bed
    } else {
      const bedId = this.beds.length + 1;
      const bed = { ...this.newBed, id: bedId };
      this.bedService.addBed(bed); // Add a new bed
    }
    this.loadBeds(); // Reload beds after saving
  }

  editBed(id: number): void {
    const bedToEdit = this.beds.find(bed => bed.id === id);
    if (bedToEdit) {
      this.newBed = { ...bedToEdit };
      this.selectedPatientId = this.newBed.patient?.id || null; // Update selected patient if any
      this.showModal = true; // Show modal to edit bed
    }
  }

  closeModal(): void {
    this.showModal = false; // Hide modal
  }

  deleteBed(id: number): void {
    this.bedService.deleteBed(id);
    this.loadBeds(); // Reload beds after deletion
  }

  toggleStatus(bed: any): void {
    const updatedStatus = bed.status === 'Occupied' ? 'Available' : 'Occupied';
    this.bedService.editBed(bed.id, { status: updatedStatus });
    this.loadBeds(); // Reload beds after status update
  }

  assignPatientToBed(bedId: number): void {
    const selectedPatient = this.patients.find(p => p.id === this.selectedPatientId);
    if (!selectedPatient) {
      console.log('No patient selected or patient not found.');
      return;
    }

    const updatedBed = this.beds.find(bed => bed.id === bedId);
    if (updatedBed) {
      updatedBed.patient = selectedPatient; // Assign patient to bed
      updatedBed.status = 'Occupied'; // Change status to 'Occupied'
      this.bedService.editBed(bedId, updatedBed); // Update bed
      this.loadBeds(); // Reload beds to reflect changes
    } else {
      console.log('No bed found with ID:', bedId);
    }
  }

  onPatientSelected() {
    if (this.selectedPatientId) {
      const selectedPatient = this.patients.find(patient => patient.id === this.selectedPatientId);
      if (selectedPatient) {
        this.newBed.patient = selectedPatient; // Assign the selected patient to the bed
      }
    } else {
      this.newBed.patient = null; // If no patient selected, set to null
    }
    console.log('Selected Patient:', this.newBed.patient);
  }

  onRoomTypeChange(): void {
    if (this.newBed.roomType) {
      const selectedRoom = this.rooms.find(room => room.type === this.newBed.roomType);
      if (selectedRoom) {
        this.newBed.room = selectedRoom;
        this.generateBedNames(); // Re-generate bed names if room is changed
      }
    }
  }

  getBedsForSelectedRoom(): any[] {
    const selectedRoom = this.rooms.find(room => room.id === this.newBed.room?.id);
    if (selectedRoom && selectedRoom.capacity) {
      return Array.from({ length: selectedRoom.capacity }, (_, i) => `Bed ${i + 1}`);
    }
    return [];
  }
}
