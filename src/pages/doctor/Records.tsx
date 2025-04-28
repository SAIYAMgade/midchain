
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Eye, 
  Download, 
  Search, 
  Copy, 
  CheckCheck,
  MessageSquare,
  Upload
} from 'lucide-react';
import { getUserMedicalRecords, findUserById } from '@/lib/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PatientInfoModal from '@/components/modals/PatientInfoModal';

const DoctorRecords: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [patientFilter, setPatientFilter] = useState('all');
  const [copiedCid, setCopiedCid] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  
  if (!user) return null;
  
  const records = getUserMedicalRecords(user.id);
  
  const patients = [...new Set(records.map(record => record.patientId))].map(
    patientId => findUserById(patientId)
  ).filter(Boolean);
  
  const filteredRecords = records.filter(record => {
    const matchesSearch = 
      record.fileName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      record.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesPatient = patientFilter === 'all' || record.patientId === patientFilter;
    
    return matchesSearch && matchesPatient;
  });
  
  const handleCopyCid = (cid: string) => {
    navigator.clipboard.writeText(cid);
    setCopiedCid(cid);
    toast.success('CID copied to clipboard!');
    
    setTimeout(() => setCopiedCid(null), 2000);
  };
  
  const truncateCid = (cid: string) => {
    return `${cid.slice(0, 6)}...${cid.slice(-4)}`;
  };
  
  const handleView = (recordId: string) => {
    toast.success('Viewing record (simulated)');
  };
  
  const handleDownload = (recordId: string) => {
    toast.success('Downloading record (simulated)');
  };
  
  const handleAddNote = (recordId: string) => {
    toast.success('Adding note (simulated)');
  };
  
  const handleViewPatient = (patientId: string) => {
    const patient = findUserById(patientId);
    setSelectedPatient(patient);
    setIsPatientModalOpen(true);
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Patient Records</h1>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search records..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="w-full md:w-[200px]">
          <Select value={patientFilter} onValueChange={setPatientFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Patients" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Patients</SelectItem>
              {patients.map(patient => (
                patient && <SelectItem key={patient.id} value={patient.id}>{patient.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-auto">
          <Button className="w-full">
            <Upload className="mr-2 h-4 w-4" />
            Upload Record
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border dark:border-gray-800">
        <Table>
          <TableHeader>
            <TableRow className="dark:border-gray-800">
              <TableHead>Patient</TableHead>
              <TableHead>File Name</TableHead>
              <TableHead>CID</TableHead>
              <TableHead>Upload Date</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecords.length > 0 ? (
              filteredRecords.map((record) => {
                const patient = findUserById(record.patientId);
                
                return (
                  <TableRow key={record.id} className="dark:border-gray-800">
                    <TableCell className="font-medium">{patient?.name}</TableCell>
                    <TableCell>{record.fileName}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono">{truncateCid(record.cid)}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() => handleCopyCid(record.cid)}
                        >
                          {copiedCid === record.cid ? (
                            <CheckCheck className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(record.uploadDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {record.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-block bg-primary/10 text-primary dark:bg-primary/20 text-xs rounded-full px-2 py-0.5"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() => handleViewPatient(record.patientId)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() => handleDownload(record.id)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() => handleAddNote(record.id)}
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <PatientInfoModal
        open={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
        patient={selectedPatient}
      />
    </div>
  );
};

export default DoctorRecords;
