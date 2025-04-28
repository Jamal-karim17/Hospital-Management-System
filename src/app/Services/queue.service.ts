import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class QueueService {
  private queueKey = 'hospitalQueues'; // 🚀 General key for all departments
  private lastQueueTimestampKey = 'queueLastTimestamp';
  private resetIntervalMs: number = 24 * 60 * 60 * 1000; // 24 hours
  private departmentQueues: { [department: string]: QueueEntry[] } = {}; // 🚀
  private currentQueueNumbers: { [department: string]: number } = {}; // 🚀

  constructor() {
    this.checkAndResetQueueIfExpired();
  }

  generateQueueNumber(department: string, patientName: string): number {
    this.checkAndResetQueueIfExpired();

    if (!this.departmentQueues[department]) {
      this.departmentQueues[department] = [];
      this.currentQueueNumbers[department] = 1;
    }

    const newQueueNumber = this.currentQueueNumbers[department]++;
    this.departmentQueues[department].push({
      number: newQueueNumber,
      patientName,
      status: 'Waiting',
      time: new Date().toLocaleTimeString()
    });

    this.saveQueues();
    return newQueueNumber;
  }

  getQueueList(department: string) {
    this.checkAndResetQueueIfExpired();
    return this.departmentQueues[department] || [];
  }

  updateStatus(department: string, queueNumber: number, status: string) {
    const patient = this.departmentQueues[department]?.find((q) => q.number === queueNumber);
    if (patient) {
      patient.status = status;
      this.saveQueues();
    }
  }

  removeFromQueue(department: string, queueNumber: number) {
    if (this.departmentQueues[department]) {
      this.departmentQueues[department] = this.departmentQueues[department].filter((q) => q.number !== queueNumber);
      this.saveQueues();
    }
  }

  private checkAndResetQueueIfExpired() {
    const now = Date.now();
    const storedTimestamp = localStorage.getItem(this.lastQueueTimestampKey);
    const lastTimestamp = storedTimestamp ? parseInt(storedTimestamp, 10) : 0;

    if (now - lastTimestamp >= this.resetIntervalMs) {
      this.departmentQueues = {};
      this.currentQueueNumbers = {};
      this.saveQueues();
      localStorage.setItem(this.lastQueueTimestampKey, now.toString());
    } else {
      this.loadQueues();
    }
  }

  private saveQueues() {
    localStorage.setItem(this.queueKey, JSON.stringify({
      queues: this.departmentQueues,
      numbers: this.currentQueueNumbers
    }));
  }

  private loadQueues() {
    const storedData = localStorage.getItem(this.queueKey);
    if (storedData) {
      const parsed = JSON.parse(storedData);
      this.departmentQueues = parsed.queues || {};
      this.currentQueueNumbers = parsed.numbers || {};
    } else {
      this.departmentQueues = {};
      this.currentQueueNumbers = {};
    }
  }
}

interface QueueEntry {
  number: number;
  patientName: string;
  status: string;
  time: string;
}
