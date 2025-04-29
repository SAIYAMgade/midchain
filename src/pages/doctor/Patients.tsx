"use client";

import React, { useState, useEffect } from "react";
import { storeMedicalRecord } from "@/lib/mockData";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Upload, User, Plus } from "lucide-react";
import { getDoctorPatients, getUserMedicalRecords } from "@/lib/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export type PatientType = {
  id: string;
  name: string;
  email: string;
  wallet: string;
};

const DoctorPatients: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState<PatientType[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientType | null>(null);
  const [showPatientDialog, setShowPatientDialog] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showAddPatientDialog, setShowAddPatientDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileTags, setFileTags] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [newPatientName, setNewPatientName] = useState("");
  const [newPatientEmail, setNewPatientEmail] = useState("");
  const [newPatientWallet, setNewPatientWallet] = useState("");
  
  useEffect(() => {
    if (user) {
      const fetchedPatients = getDoctorPatients(user.id);
      setPatients(fetchedPatients);
    }
  }, [user]);

  if (!user) return null;

  const truncateWallet = (wallet: string) => `${wallet.slice(0, 4)}...${wallet.slice(-4)}`;

  const getPatientRecordCount = (patientId: string) => getUserMedicalRecords(patientId).length;

  const getLastUploadDate = (patientId: string) => {
    const records = getUserMedicalRecords(patientId);
    if (records.length === 0) return "No records";
    const sortedRecords = [...records].sort(
      (a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
    );
    return new Date(sortedRecords[0].uploadDate).toLocaleDateString();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    setIsUploading(true);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          toast.success(`File uploaded successfully for ${selectedPatient?.name}`);
          setSelectedFile(null);
          setFileTags("");
          setShowUploadDialog(false);
          setUploadProgress(0);

          // Store the medical record after upload
          if (selectedPatient) {
            storeMedicalRecord(selectedPatient.id, {
              id: generateUniqueId(),
              name: selectedFile.name,
              url: URL.createObjectURL(selectedFile),
              tags: fileTags,
              uploadDate: new Date().toISOString(),
            });
          }

          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleAddPatient = () => {
    if (!newPatientName || !newPatientEmail || !newPatientWallet) {
      toast.error("Please fill in all fields");
      return;
    }

    const newPatient: PatientType = {
      id: Date.now().toString(),
      name: newPatientName,
      email: newPatientEmail,
      wallet: newPatientWallet,
    };

    setPatients((prev) => [...prev, newPatient]);
    toast.success("Patient added successfully");
    setShowAddPatientDialog(false);
    setNewPatientName("");
    setNewPatientEmail("");
    setNewPatientWallet("");
  };

  const filteredPatients = patients.filter((patient) =>
    `${patient.name} ${patient.email} ${patient.wallet}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Patients</h1>
        <Button onClick={() => setShowAddPatientDialog(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Patient
        </Button>
      </div>

      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search patients..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Wallet</TableHead>
              <TableHead>Records</TableHead>
              <TableHead>Last Upload</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>{patient.name}</TableCell>
                  <TableCell>{truncateWallet(patient.wallet)}</TableCell>
                  <TableCell>{getPatientRecordCount(patient.id)}</TableCell>
                  <TableCell>{getLastUploadDate(patient.id)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" size="sm" onClick={() => { setSelectedPatient(patient); setShowPatientDialog(true); }}>
                        <User className="mr-2 h-4 w-4" /> Details
                      </Button>
                      <Button size="sm" onClick={() => { setSelectedPatient(patient); setShowUploadDialog(true); }}>
                        <Upload className="mr-2 h-4 w-4" /> Upload
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">No patients found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Medical Record</DialogTitle>
            <DialogDescription>
              Upload a medical record for <strong>{selectedPatient?.name}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input type="file" onChange={handleFileChange} />
            <Input
              placeholder="Tags (comma-separated)"
              value={fileTags}
              onChange={(e) => setFileTags(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadDialog(false)}>Cancel</Button>
            <Button disabled={isUploading} onClick={handleUpload}>
              {isUploading ? `Uploading (${uploadProgress}%)...` : "Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Patient Details Dialog */}
      <Dialog open={showPatientDialog} onOpenChange={setShowPatientDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Patient Details</DialogTitle>
          </DialogHeader>
          {selectedPatient ? (
            <div className="space-y-2">
              <p><strong>Name:</strong> {selectedPatient.name}</p>
              <p><strong>Email:</strong> {selectedPatient.email}</p>
              <p><strong>Wallet:</strong> {selectedPatient.wallet}</p>
              <p><strong>Records:</strong> {getPatientRecordCount(selectedPatient.id)}</p>
              <p><strong>Last Upload:</strong> {getLastUploadDate(selectedPatient.id)}</p>
            </div>
          ) : (
            <p>No patient selected.</p>
          )}
          <DialogFooter>
            <Button onClick={() => setShowPatientDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Patient Dialog */}
      <Dialog open={showAddPatientDialog} onOpenChange={setShowAddPatientDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Patient</DialogTitle>
            <DialogDescription>Fill in the details below to add a new patient.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Patient Name" value={newPatientName} onChange={(e) => setNewPatientName(e.target.value)} />
            <Input placeholder="Email" value={newPatientEmail} onChange={(e) => setNewPatientEmail(e.target.value)} />
            <Input placeholder="Wallet Address" value={newPatientWallet} onChange={(e) => setNewPatientWallet(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddPatientDialog(false)}>Cancel</Button>
            <Button onClick={handleAddPatient}>Add Patient</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorPatients;
