
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
  Search, 
  X, 
  UserCheck, 
  Shield 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getUserMedicalRecords, findUserById } from '@/lib/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Type augmentation for MedicalRecord to include sharedWith
interface EnhancedMedicalRecord {
  id: string;
  fileName: string;
  uploadDate: string;
  tags: string[];
  sharedWith?: string[];
}

const PatientAccess: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showGrantDialog, setShowGrantDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<EnhancedMedicalRecord | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  
  if (!user) return null;
  
  // Cast the records to our enhanced type that includes sharedWith
  const records = getUserMedicalRecords(user.id) as EnhancedMedicalRecord[];
  
  // Get distinct doctor IDs from all records' sharedWith arrays
  const doctorIds = Array.from(new Set(records.flatMap(r => r.sharedWith || [])));
  
  // Get doctor objects from doctor IDs
  const doctors = doctorIds
    .map(id => findUserById(id))
    .filter(Boolean);
  
  const doctorsNotSharedWith = (recordId: string) => {
    const record = records.find(r => r.id === recordId);
    if (!record) return [];
    
    const sharedWith = record.sharedWith || [];
    
    // Make sure findUserById returns an array we can filter
    const allDoctors = findUserById ? findUserById('all') : [];
    if (Array.isArray(allDoctors)) {
      return allDoctors.filter(user => user.role === 'doctor' && !sharedWith.includes(user.id));
    }
    return [];
  };
  
  const filteredRecords = records.filter(record => 
    record.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const openGrantDialog = (record: any) => {
    setSelectedRecord(record);
    setShowGrantDialog(true);
  };
  
  const handleGrantAccess = () => {
    if (!selectedRecord || !selectedDoctor) {
      toast.error('Please select a doctor to grant access');
      return;
    }
    
    // In a real app, this would call an API to grant access
    toast.success(`Access granted to the selected doctor for ${selectedRecord.fileName}`);
    setShowGrantDialog(false);
    setSelectedDoctor('');
  };
  
  const handleRevokeAccess = (recordId: string, doctorId: string) => {
    // In a real app, this would call an API to revoke access
    toast.success('Access revoked successfully');
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Shield className="h-6 w-6" />
        Manage Access
      </h1>
      
      <div className="mb-6">
        <Tabs defaultValue="granted">
          <TabsList className="w-full">
            <TabsTrigger value="granted" className="flex-1">Granted Access</TabsTrigger>
            <TabsTrigger value="manage" className="flex-1">Manage Files</TabsTrigger>
          </TabsList>
          
          <TabsContent value="granted" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Doctors with Access</CardTitle>
                </div>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search doctors..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Doctor</TableHead>
                        <TableHead>Files Access</TableHead>
                        <TableHead>Date Granted</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {doctors.length > 0 ? (
                        doctors.map((doctor) => {
                          const filesShared = records.filter(
                            record => record.sharedWith && record.sharedWith.includes(doctor?.id || '')
                          );
                          
                          return doctor ? (
                            <TableRow key={doctor.id}>
                              <TableCell className="font-medium">{doctor.name}</TableCell>
                              <TableCell>{filesShared.length} files</TableCell>
                              <TableCell>Apr 24, 2025</TableCell>
                              <TableCell className="text-right">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="text-destructive"
                                  onClick={() => handleRevokeAccess('all', doctor.id)}
                                >
                                  <X className="mr-1 h-4 w-4" />
                                  Revoke All
                                </Button>
                              </TableCell>
                            </TableRow>
                          ) : null;
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="h-24 text-center">
                            No doctors have been granted access
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="manage" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Files Access Management</CardTitle>
                </div>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search files..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>File</TableHead>
                        <TableHead>Shared With</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRecords.length > 0 ? (
                        filteredRecords.map((record) => {
                          const doctorsWithAccess = (record.sharedWith || [])
                            .map(id => findUserById(id))
                            .filter(Boolean);
                          
                          return (
                            <TableRow key={record.id}>
                              <TableCell>
                                <div>
                                  <p className="font-medium">{record.fileName}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(record.uploadDate).toLocaleDateString()}
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {doctorsWithAccess.length > 0 ? (
                                    doctorsWithAccess.map((doctor) => (
                                      doctor && (
                                        <Badge key={doctor.id} variant="secondary" className="flex items-center gap-1">
                                          {doctor.name}
                                          <X 
                                            className="h-3 w-3 cursor-pointer" 
                                            onClick={() => handleRevokeAccess(record.id, doctor.id)}
                                          />
                                        </Badge>
                                      )
                                    ))
                                  ) : (
                                    <span className="text-sm text-muted-foreground">Not shared</span>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button 
                                  size="sm"
                                  onClick={() => openGrantDialog(record)}
                                >
                                  <UserCheck className="mr-1 h-4 w-4" />
                                  Grant Access
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} className="h-24 text-center">
                            No records found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <Dialog open={showGrantDialog} onOpenChange={setShowGrantDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Grant Access</DialogTitle>
            <DialogDescription>
              Select a doctor to grant access to this medical record
            </DialogDescription>
          </DialogHeader>
          
          {selectedRecord && (
            <div className="py-2">
              <div className="mb-4 p-3 bg-muted rounded-md">
                <h4 className="font-medium">Selected File:</h4>
                <p>{selectedRecord.fileName}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedRecord.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Choose Doctor</label>
                  <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctorsNotSharedWith(selectedRecord.id).map(doctor => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          {doctor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setShowGrantDialog(false)}>Cancel</Button>
            <Button onClick={handleGrantAccess}>Grant Access</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientAccess;
