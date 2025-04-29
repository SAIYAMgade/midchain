"use client";

import React, { useState } from "react";
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

// Type for patient structure
type PatientType = {
  id: string;
  name: string;
  email: string;
  wallet: string;
};

const DoctorPatients: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [showPatientDialog, setShowPatientDialog] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<PatientType | null>(
    null
  );
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileTags, setFileTags] = useState("");

  // Add Patient Dialog state
  const [showAddPatientDialog, setShowAddPatientDialog] = useState(false);
  const [newPatientName, setNewPatientName] = useState("");
  const [newPatientEmail, setNewPatientEmail] = useState("");
  const [newPatientWallet, setNewPatientWallet] = useState("");

  if (!user) return null;

  // Fetch mock patients
  const patients = getDoctorPatients(user.id);

  // Search filtering
  const filteredPatients = patients.filter((patient) =>
    `${patient.name} ${patient.email} ${patient.wallet}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const truncateWallet = (wallet: string) =>
    `${wallet.slice(0, 4)}...${wallet.slice(-4)}`;

  const getPatientRecordCount = (patientId: string) =>
    getUserMedicalRecords(patientId).length;

  const getLastUploadDate = (patientId: string) => {
    const records = getUserMedicalRecords(patientId);
    if (records.length === 0) return "No records";
    const sortedRecords = [...records].sort(
      (a, b) =>
        new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
    );
    return new Date(sortedRecords[0].uploadDate).toLocaleDateString();
  };

  // Action handlers
  const handleViewPatient = (patient: PatientType) => {
    setSelectedPatient(patient);
    setShowPatientDialog(true);
  };

  const handleShowUploadDialog = (patient: PatientType) => {
    setSelectedPatient(patient);
    setShowUploadDialog(true);
  };

  const handleAddPatient = () => {
    setShowAddPatientDialog(true);
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
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsUploading(false);
          toast.success(
            `File ${selectedFile.name} uploaded successfully for ${selectedPatient?.name}`
          );
          setShowUploadDialog(false);
          setSelectedFile(null);
          setFileTags("");
          setUploadProgress(0);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleSaveNewPatient = () => {
    if (!newPatientName || !newPatientEmail || !newPatientWallet) {
      toast.error("Please fill in all fields.");
      return;
    }
    toast.success(`Patient ${newPatientName} added!`);
    setShowAddPatientDialog(false);
    setNewPatientName("");
    setNewPatientEmail("");
    setNewPatientWallet("");
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Patients</h1>
        <Button onClick={handleAddPatient}>
          <Plus className="mr-2 h-4 w-4" />
          Add Patient
        </Button>
      </div>

      {/* Search Input */}
      <div className="flex items-center mb-6">
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

      {/* Patients Table */}
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
                  <TableCell className="font-medium">{patient.name}</TableCell>
                  <TableCell className="font-mono">
                    {truncateWallet(patient.wallet)}
                  </TableCell>
                  <TableCell>
                    {getPatientRecordCount(patient.id)}
                  </TableCell>
                  <TableCell>{getLastUploadDate(patient.id)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewPatient(patient)}
                      >
                        <User className="mr-2 h-4 w-4" />
                        Details
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleShowUploadDialog(patient)}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No patients found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Patient Dialog */}
      <Dialog open={showAddPatientDialog} onOpenChange={setShowAddPatientDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Patient</DialogTitle>
            <DialogDescription>
              Enter patient details below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Patient Name"
              value={newPatientName}
              onChange={(e) => setNewPatientName(e.target.value)}
            />
            <Input
              type="email"
              placeholder="Email"
              value={newPatientEmail}
              onChange={(e) => setNewPatientEmail(e.target.value)}
            />
            <Input
              placeholder="Wallet Address"
              value={newPatientWallet}
              onChange={(e) => setNewPatientWallet(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddPatientDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveNewPatient}>
              <Plus className="mr-2 h-4 w-4" /> Add Patient
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorPatients;
