import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class QueueService {
  private queueKey = 'pharmacyQueue';
  private lastQueueTimestampKey = 'queueLastTimestamp';
  private resetIntervalMs: number = 24 * 60 * 60 * 1000; // 24 hours
  private currentQueueNumber = 1;

  private queue: { number: number; patientName: string; status: string; time: string }[] = [];

  constructor() {
    this.checkAndResetQueueIfExpired();
  }

  generateQueueNumber(patientName: string): number {
    this.checkAndResetQueueIfExpired();

    const newQueueNumber = this.currentQueueNumber++;
    this.queue.push({
      number: newQueueNumber,
      patientName,
      status: 'Waiting',
      time: new Date().toLocaleTimeString() // ✅ Add time here
    });

    this.saveQueue();
    return newQueueNumber;
  }

  getQueueList() {
    this.checkAndResetQueueIfExpired();
    return this.queue;
  }

  updateStatus(queueNumber: number, status: string) {
    const patient = this.queue.find((q) => q.number === queueNumber);
    if (patient) {
      patient.status = status;
      this.saveQueue();
    }
  }

  removeFromQueue(queueNumber: number) {
    this.queue = this.queue.filter((q) => q.number !== queueNumber);
    this.saveQueue();
  }

  private checkAndResetQueueIfExpired() {
    const now = Date.now();
    const storedTimestamp = localStorage.getItem(this.lastQueueTimestampKey);
    const lastTimestamp = storedTimestamp ? parseInt(storedTimestamp, 10) : 0;

    if (now - lastTimestamp >= this.resetIntervalMs) {
      this.queue = [];
      this.currentQueueNumber = 1;
      this.saveQueue();
      localStorage.setItem(this.lastQueueTimestampKey, now.toString());
    } else {
      this.loadQueue();
    }
  }

  private saveQueue() {
    localStorage.setItem(this.queueKey, JSON.stringify(this.queue));
  }

  private loadQueue() {
    const storedQueue = localStorage.getItem(this.queueKey);
    this.queue = storedQueue ? JSON.parse(storedQueue) : [];

    // Reset currentQueueNumber correctly
    if (this.queue.length > 0) {
      const lastNumber = Math.max(...this.queue.map((q) => q.number));
      this.currentQueueNumber = lastNumber + 1;
    } else {
      this.currentQueueNumber = 1;
    }
  }
}
