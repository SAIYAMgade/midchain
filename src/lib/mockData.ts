// --------------------
// Types / Interfaces
// --------------------

export interface User {
  id: string;
  name: string;
  email: string;
  wallet: string;
  role: 'patient' | 'doctor';
  password?: string; // Only for demo
  avatar?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  datetime: string;
  status: 'Requested' | 'Accepted' | 'Completed' | 'Cancelled';
  reason: string;
}

export interface MedicalRecord {
  id: string;
  fileName: string;
  cid: string;
  uploadDate: string;
  patientId: string;
  uploadedBy: string;
  accessList: string[]; // User IDs
  tags: string[];
}

export interface AccessRequest {
  id: string;
  fileId: string;
  requesterId: string;
  ownerId: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  requestDate: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'access' | 'upload' | 'appointment' | 'system';
  relatedId?: string;
}

// --------------------
// Mock Data
// --------------------

export const users: User[] = [
  { id: "user1", name: "Alice Patel", email: "alice@example.com", wallet: "0xUser1", role: "patient", password: "password", avatar: "/placeholder.svg" },
  { id: "user2", name: "Bob Rao", email: "bob@example.com", wallet: "0xUser2", role: "patient", password: "password", avatar: "/placeholder.svg" },
];

export const doctors: User[] = [
  { id: "doc1", name: "Dr. Sara Singh", email: "sara@example.com", wallet: "0xDoc1", role: "doctor", password: "password", avatar: "/placeholder.svg" },
  { id: "doc2", name: "Dr. Vikram Roy", email: "vikram@example.com", wallet: "0xDoc2", role: "doctor", password: "password", avatar: "/placeholder.svg" },
];

export const appointments: Appointment[] = [
  { id: "apt1", patientId: "user1", doctorId: "doc1", datetime: "2025-05-01T10:00:00Z", status: "Accepted", reason: "Annual check-up" },
  { id: "apt2", patientId: "user2", doctorId: "doc2", datetime: "2025-05-03T14:30:00Z", status: "Requested", reason: "Follow-up on medication" },
  { id: "apt3", patientId: "user1", doctorId: "doc2", datetime: "2025-05-10T11:00:00Z", status: "Accepted", reason: "Blood test results review" },
  { id: "apt4", patientId: "user2", doctorId: "doc1", datetime: "2025-05-15T09:30:00Z", status: "Requested", reason: "Chronic pain consultation" },
];

export const medicalRecords: MedicalRecord[] = [
  { id: "rec1", fileName: "Blood Test Results.pdf", cid: "QmT8JZ3...", uploadDate: "2025-04-10T15:30:00Z", patientId: "user1", uploadedBy: "doc1", accessList: ["user1", "doc1"], tags: ["lab", "blood test", "routine"] },
  { id: "rec2", fileName: "X-Ray Chest.jpg", cid: "QmUv5YF8...", uploadDate: "2025-04-12T09:45:00Z", patientId: "user1", uploadedBy: "user1", accessList: ["user1", "doc1", "doc2"], tags: ["imaging", "x-ray", "chest"] },
  { id: "rec3", fileName: "Prescription.pdf", cid: "QmR9MZGb...", uploadDate: "2025-04-15T14:20:00Z", patientId: "user2", uploadedBy: "doc2", accessList: ["user2", "doc2"], tags: ["prescription", "medication"] },
  { id: "rec4", fileName: "Allergy Test Results.pdf", cid: "QmPZ9A7H...", uploadDate: "2025-04-18T11:10:00Z", patientId: "user2", uploadedBy: "user2", accessList: ["user2", "doc1", "doc2"], tags: ["lab", "allergy", "test"] },
];

export const accessRequests: AccessRequest[] = [
  { id: "req1", fileId: "rec2", requesterId: "doc2", ownerId: "user1", status: "Approved", requestDate: "2025-04-11T10:20:00Z" },
  { id: "req2", fileId: "rec4", requesterId: "doc1", ownerId: "user2", status: "Pending", requestDate: "2025-04-19T08:15:00Z" },
];

export const notifications: Notification[] = [
  { id: "notif1", userId: "user1", message: "Dr. Sara Singh viewed your Blood Test Results.pdf", timestamp: "2025-04-20T14:30:00Z", read: false, type: "access", relatedId: "rec1" },
  { id: "notif2", userId: "user2", message: "Dr. Vikram Roy approved your appointment request", timestamp: "2025-04-21T09:45:00Z", read: true, type: "appointment", relatedId: "apt2" },
  { id: "notif3", userId: "doc1", message: "New access request from Alice Patel", timestamp: "2025-04-21T15:20:00Z", read: false, type: "access", relatedId: "req1" },
];

// --------------------
// Uploaded Records Store (Separate Feature)
// --------------------

export type UploadedMedicalRecord = {
  id: string;
  name: string;
  url: string;
  tags: string;
  uploadDate: string;
};

const uploadedRecordsStore: Record<string, UploadedMedicalRecord[]> = {};

// Store uploaded medical record
export function storeMedicalRecord(patientId: string, record: UploadedMedicalRecord) {
  if (!uploadedRecordsStore[patientId]) uploadedRecordsStore[patientId] = [];
  uploadedRecordsStore[patientId].push(record);
}

// Get uploaded medical records
export function getUploadedMedicalRecords(patientId: string): UploadedMedicalRecord[] {
  return uploadedRecordsStore[patientId] || [];
}

// --------------------
// Helper Functions
// --------------------

// Get all users
export function getAllUsers(): User[] {
  return [...users, ...doctors];
}

// Find a user by email
export function findUserByEmail(email: string): User | undefined {
  return getAllUsers().find(user => user.email === email);
}

// Find a user by ID
export function findUserById(id: string): User | undefined {
  return getAllUsers().find(user => user.id === id);
}

// Get appointments for a user
export function getUserAppointments(userId: string): Appointment[] {
  const user = findUserById(userId);
  if (!user) return [];
  return user.role === 'patient'
    ? appointments.filter(a => a.patientId === userId)
    : appointments.filter(a => a.doctorId === userId);
}

// Get medical records for a user
export function getUserMedicalRecords(userId: string): MedicalRecord[] {
  const user = findUserById(userId);
  if (!user) return [];
  return user.role === 'patient'
    ? medicalRecords.filter(r => r.patientId === userId)
    : medicalRecords.filter(r => r.accessList.includes(userId));
}

// Get notifications for a user
export function getUserNotifications(userId: string): Notification[] {
  return notifications.filter(n => n.userId === userId);
}

// Get access requests for a user
export function getUserAccessRequests(userId: string): AccessRequest[] {
  const user = findUserById(userId);
  if (!user) return [];
  return user.role === 'patient'
    ? accessRequests.filter(r => r.ownerId === userId)
    : accessRequests.filter(r => r.requesterId === userId);
}

// Get doctors for a patient
export function getPatientDoctors(patientId: string): User[] {
  const doctorIds = new Set(appointments.filter(a => a.patientId === patientId).map(a => a.doctorId));
  return doctors.filter(d => doctorIds.has(d.id));
}

// Get patients for a doctor
export function getDoctorPatients(doctorId: string): User[] {
  const patientIds = new Set(appointments.filter(a => a.doctorId === doctorId).map(a => a.patientId));
  return users.filter(u => patientIds.has(u.id));
}
