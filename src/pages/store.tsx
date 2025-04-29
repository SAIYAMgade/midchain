// src/pages/store.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { getDoctorPatients, getUserMedicalRecords } from "@/lib/mockData";

type RecordType = {
  id: string;
  name: string;
  url: string;
  tags?: string;
  uploadDate: string;
  patientName: string;
  patientEmail: string;
  patientWallet: string;
};

const StorePage: React.FC = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState<RecordType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!user) return;

    const fetchedPatients = getDoctorPatients(user.id);

    const fetchedRecords = fetchedPatients.flatMap((patient) =>
      getUserMedicalRecords(patient.id).map((record) => ({
        ...record,
        patientName: patient.name,
        patientEmail: patient.email,
        patientWallet: patient.wallet,
      }))
    );

    // Optional: sort by upload date (newest first)
    fetchedRecords.sort(
      (a, b) =>
        new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
    );

    setRecords(fetchedRecords);
  }, [user]);

  if (!user) return <p className="p-6 text-red-500">Unauthorized. Please log in.</p>;

  const filteredRecords = records.filter((record) =>
    `${record.patientName} ${record.patientEmail} ${record.patientWallet} ${record.name} ${record.tags}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Medical Records Store</h1>

      <Input
        type="text"
        placeholder="Search records or patients..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-md mb-6"
      />

      {filteredRecords.length === 0 ? (
        <p className="text-gray-600">No records uploaded yet.</p>
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Wallet</TableHead>
                <TableHead>File</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((rec) => (
                <TableRow key={rec.id}>
                  <TableCell>{rec.patientName}</TableCell>
                  <TableCell>{rec.patientEmail}</TableCell>
                  <TableCell className="font-mono">{rec.patientWallet}</TableCell>
                  <TableCell>
                    <Link href={rec.url} target="_blank" className="underline">
                      {rec.name}
                    </Link>
                  </TableCell>
                  <TableCell>{rec.tags || "—"}</TableCell>
                  <TableCell>
                    {rec.uploadDate
                      ? new Date(rec.uploadDate).toLocaleDateString()
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={rec.url}
                      target="_blank"
                      className="text-blue-500 hover:underline"
                    >
                      Download
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default StorePage;
