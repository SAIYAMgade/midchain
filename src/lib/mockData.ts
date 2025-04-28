// Mock data for the EHR blockchain application

export interface User {
  id: string;
  name: string;
  email: string;
  wallet: string;
  role: 'patient' | 'doctor';
  password?: string; // Only used for demo login
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
  accessList: string[]; // Array of user IDs who can access
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

// Mock data
export const users: User[] = [
  { 
    id: "user1", 
    name: "Alice Patel", 
    email: "alice@example.com", 
    wallet: "0xUser1", 
    role: "patient", 
    password: "password",
    avatar: "/placeholder.svg"
  },
  { 
    id: "user2", 
    name: "Bob Rao", 
    email: "bob@example.com", 
    wallet: "0xUser2", 
    role: "patient", 
    password: "password",
    avatar: "/placeholder.svg"
  },
];

export const doctors: User[] = [
  { 
    id: "doc1", 
    name: "Dr. Sara Singh", 
    email: "sara@example.com", 
    wallet: "0xDoc1", 
    role: "doctor", 
    password: "password",
    avatar: "/placeholder.svg"
  },
  { 
    id: "doc2", 
    name: "Dr. Vikram Roy", 
    email: "vikram@example.com", 
    wallet: "0xDoc2", 
    role: "doctor", 
    password: "password",
    avatar: "/placeholder.svg"
  },
];

export const appointments: Appointment[] = [
  { 
    id: "apt1",
    patientId: "user1", 
    doctorId: "doc1", 
    datetime: "2025-05-01T10:00:00Z", 
    status: "Accepted", 
    reason: "Annual check-up" 
  },
  { 
    id: "apt2",
    patientId: "user2", 
    doctorId: "doc2", 
    datetime: "2025-05-03T14:30:00Z", 
    status: "Requested", 
    reason: "Follow-up on medication" 
  },
  { 
    id: "apt3",
    patientId: "user1", 
    doctorId: "doc2", 
    datetime: "2025-05-10T11:00:00Z", 
    status: "Accepted", 
    reason: "Blood test results review" 
  },
  {
    id: "apt4",
    patientId: "user2",
    doctorId: "doc1",
    datetime: "2025-05-15T09:30:00Z",
    status: "Requested",
    reason: "Chronic pain consultation"
  }
];

export const medicalRecords: MedicalRecord[] = [
  {
    id: "rec1",
    fileName: "Blood Test Results.pdf",
    cid: "QmT8JZ3NCdQHBnvBtdB5o6U3qqXw5K9Dg7DZGQHj7r4Ld1",
    uploadDate: "2025-04-10T15:30:00Z",
    patientId: "user1",
    uploadedBy: "doc1",
    accessList: ["user1", "doc1"],
    tags: ["lab", "blood test", "routine"]
  },
  {
    id: "rec2",
    fileName: "X-Ray Chest.jpg",
    cid: "QmUv5YF8NKzLbdKvDFY5x8RhK2U5QTJ9c2j1HuZvZ7Y7Yf",
    uploadDate: "2025-04-12T09:45:00Z",
    patientId: "user1",
    uploadedBy: "user1",
    accessList: ["user1", "doc1", "doc2"],
    tags: ["imaging", "x-ray", "chest"]
  },
  {
    id: "rec3",
    fileName: "Prescription.pdf",
    cid: "QmR9MZGbMwKzs4XxZLvEy3H5HK6JJ7ysYfQr6wQMZCH4X5",
    uploadDate: "2025-04-15T14:20:00Z",
    patientId: "user2",
    uploadedBy: "doc2",
    accessList: ["user2", "doc2"],
    tags: ["prescription", "medication"]
  },
  {
    id: "rec4",
    fileName: "Allergy Test Results.pdf",
    cid: "QmPZ9A7HVKDTYzKbvF7V2qrRJZPG6KJ5ZY5VYZ3J4Y2J2J",
    uploadDate: "2025-04-18T11:10:00Z",
    patientId: "user2",
    uploadedBy: "user2",
    accessList: ["user2", "doc1", "doc2"],
    tags: ["lab", "allergy", "test"]
  }
];

export const accessRequests: AccessRequest[] = [
  {
    id: "req1",
    fileId: "rec2",
    requesterId: "doc2",
    ownerId: "user1",
    status: "Approved",
    requestDate: "2025-04-11T10:20:00Z"
  },
  {
    id: "req2",
    fileId: "rec4",
    requesterId: "doc1",
    ownerId: "user2",
    status: "Pending",
    requestDate: "2025-04-19T08:15:00Z"
  }
];

export const notifications: Notification[] = [
  {
    id: "notif1",
    userId: "user1",
    message: "Dr. Sara Singh viewed your Blood Test Results.pdf",
    timestamp: "2025-04-20T14:30:00Z",
    read: false,
    type: "access",
    relatedId: "rec1"
  },
  {
    id: "notif2",
    userId: "user2",
    message: "Dr. Vikram Roy approved your appointment request",
    timestamp: "2025-04-21T09:45:00Z",
    read: true,
    type: "appointment",
    relatedId: "apt2"
  },
  {
    id: "notif3",
    userId: "doc1",
    message: "New access request from Alice Patel",
    timestamp: "2025-04-21T15:20:00Z",
    read: false,
    type: "access",
    relatedId: "req1"
  }
];

// Helper function to get all users
export function getAllUsers(): User[] {
  return [...users, ...doctors];
}

// Helper function to find a user by email
export function findUserByEmail(email: string): User | undefined {
  return getAllUsers().find(user => user.email === email);
}

// Helper function to find a user by ID
export function findUserById(id: string): User | undefined {
  return getAllUsers().find(user => user.id === id);
}

// Helper function to get user's appointments
export function getUserAppointments(userId: string): Appointment[] {
  const user = findUserById(userId);
  if (!user) return [];
  
  if (user.role === 'patient') {
    return appointments.filter(apt => apt.patientId === userId);
  } else {
    return appointments.filter(apt => apt.doctorId === userId);
  }
}

// Helper function to get user's medical records
export function getUserMedicalRecords(userId: string): MedicalRecord[] {
  const user = findUserById(userId);
  if (!user) return [];
  
  if (user.role === 'patient') {
    return medicalRecords.filter(rec => rec.patientId === userId);
  } else {
    // For doctors, return all records they have access to
    return medicalRecords.filter(rec => rec.accessList.includes(userId));
  }
}

// Helper function to get user's notifications
export function getUserNotifications(userId: string): Notification[] {
  return notifications.filter(notif => notif.userId === userId);
}

// Helper function to get user's access requests
export function getUserAccessRequests(userId: string): AccessRequest[] {
  const user = findUserById(userId);
  if (!user) return [];
  
  if (user.role === 'patient') {
    return accessRequests.filter(req => req.ownerId === userId);
  } else {
    return accessRequests.filter(req => req.requesterId === userId);
  }
}

// Helper function for patients' doctors
export function getPatientDoctors(patientId: string): User[] {
  const patientAppointments = appointments.filter(apt => apt.patientId === patientId);
  const doctorIds = [...new Set(patientAppointments.map(apt => apt.doctorId))];
  return doctors.filter(doc => doctorIds.includes(doc.id));
}

// Helper function for doctors' patients
export function getDoctorPatients(doctorId: string): User[] {
  const doctorAppointments = appointments.filter(apt => apt.doctorId === doctorId);
  const patientIds = [...new Set(doctorAppointments.map(apt => apt.patientId))];
  return users.filter(user => patientIds.includes(user.id));
}
