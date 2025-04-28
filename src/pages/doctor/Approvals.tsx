
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
  Clock,
  ShieldCheck,
  Check,
  X,
  User
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { findUserById } from '@/lib/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for access requests
const mockAccessRequests = [
  {
    id: 'req1',
    patientId: 'user1',
    doctorId: 'doc1',
    requestDate: '2025-04-20',
    status: 'Pending',
    reason: 'Need access to medical history for consultation'
  },
  {
    id: 'req2',
    patientId: 'user2',
    doctorId: 'doc1',
    requestDate: '2025-04-15',
    status: 'Approved',
    reason: 'Access to vaccination records'
  },
  {
    id: 'req3',
    patientId: 'user1',
    doctorId: 'doc1',
    requestDate: '2025-04-10',
    status: 'Rejected',
    reason: 'Need to check previous lab results',
    rejectionReason: 'Patient no longer under my care'
  }
];

const DoctorApprovals: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [showPatientDialog, setShowPatientDialog] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [responseNote, setResponseNote] = useState('');
  
  if (!user) return null;
  
  const filteredRequests = mockAccessRequests.filter(req => {
    const patient = findUserById(req.patientId);
    return patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           req.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
           req.status.toLowerCase().includes(searchTerm.toLowerCase());
  });
  
  const pendingRequests = filteredRequests.filter(req => req.status === 'Pending');
  const pastRequests = filteredRequests.filter(req => req.status !== 'Pending');
  
  const viewPatientDetails = (patientId: string) => {
    const patient = findUserById(patientId);
    setSelectedPatient(patient);
    setShowPatientDialog(true);
  };
  
  const viewRequestDetails = (request: any) => {
    setSelectedRequest(request);
    setShowRequestDialog(true);
  };
  
  const handleApproveRequest = () => {
    if (!selectedRequest) return;
    
    // In a real app, this would call an API to approve the request
    toast.success('Request approved successfully');
    setShowRequestDialog(false);
    setResponseNote('');
  };
  
  const handleRejectRequest = () => {
    if (!selectedRequest) return;
    
    if (!responseNote.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    
    // In a real app, this would call an API to reject the request
    toast.success('Request rejected successfully');
    setShowRequestDialog(false);
    setResponseNote('');
  };
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return '';
    }
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <ShieldCheck className="h-6 w-6" />
        Access Approvals
      </h1>
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by patient name or reason..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs defaultValue="pending" className="mb-6">
        <TabsList>
          <TabsTrigger value="pending" className="flex items-center gap-1">
            <Badge variant="outline">{pendingRequests.length}</Badge>
            Pending Requests
          </TabsTrigger>
          <TabsTrigger value="history">Request History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pending Access Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Request Date</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingRequests.length > 0 ? (
                      pendingRequests.map((request) => {
                        const patient = findUserById(request.patientId);
                        
                        return (
                          <TableRow key={request.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 rounded-full"
                                  onClick={() => viewPatientDetails(request.patientId)}
                                >
                                  <User className="h-4 w-4" />
                                </Button>
                                {patient?.name}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3 text-muted-foreground" />
                                <span>{new Date(request.requestDate).toLocaleDateString()}</span>
                              </div>
                            </TableCell>
                            <TableCell className="max-w-xs truncate" title={request.reason}>
                              {request.reason}
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(request.status)}>
                                {request.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => viewRequestDetails(request)}
                                >
                                  View Details
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => {
                                    setSelectedRequest(request);
                                    setShowRequestDialog(true);
                                  }}
                                >
                                  <X className="mr-1 h-4 w-4" />
                                  Reject
                                </Button>
                                <Button 
                                  variant="default" 
                                  size="sm"
                                  onClick={() => {
                                    setSelectedRequest(request);
                                    handleApproveRequest();
                                  }}
                                >
                                  <Check className="mr-1 h-4 w-4" />
                                  Approve
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No pending requests
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Request History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Request Date</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Response Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pastRequests.length > 0 ? (
                      pastRequests.map((request) => {
                        const patient = findUserById(request.patientId);
                        
                        return (
                          <TableRow key={request.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 rounded-full"
                                  onClick={() => viewPatientDetails(request.patientId)}
                                >
                                  <User className="h-4 w-4" />
                                </Button>
                                {patient?.name}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3 text-muted-foreground" />
                                <span>{new Date(request.requestDate).toLocaleDateString()}</span>
                              </div>
                            </TableCell>
                            <TableCell className="max-w-xs truncate" title={request.reason}>
                              {request.reason}
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(request.status)}>
                                {request.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Clock className="h-3 w-3 text-muted-foreground" />
                                <span>{new Date('2025-04-22').toLocaleDateString()}</span>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => viewRequestDetails(request)}
                                >
                                  Details
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No request history
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
      
      {/* Request Details Dialog */}
      <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Access Request</DialogTitle>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="py-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-muted rounded-full p-2">
                      <User className="h-4 w-4 text-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{findUserById(selectedRequest.patientId)?.name}</p>
                      <p className="text-xs text-muted-foreground">Patient</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(selectedRequest.status)}>
                    {selectedRequest.status}
                  </Badge>
                </div>
                
                <div className="grid gap-4 bg-muted/50 p-4 rounded-md">
                  <div>
                    <p className="text-sm text-muted-foreground">Request Date</p>
                    <p className="font-medium">{new Date(selectedRequest.requestDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Reason for Access</p>
                    <p>{selectedRequest.reason}</p>
                  </div>
                  {selectedRequest.status === 'Rejected' && selectedRequest.rejectionReason && (
                    <div>
                      <p className="text-sm text-muted-foreground">Rejection Reason</p>
                      <p>{selectedRequest.rejectionReason}</p>
                    </div>
                  )}
                </div>
                
                {selectedRequest.status === 'Pending' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Response Note (Required for rejection)</label>
                    <Textarea 
                      placeholder="Enter reason for approval or rejection..."
                      value={responseNote}
                      onChange={(e) => setResponseNote(e.target.value)}
                      rows={3}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
          
          <DialogFooter>
            {selectedRequest?.status === 'Pending' ? (
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:justify-between">
                <Button variant="outline" onClick={() => setShowRequestDialog(false)}>Cancel</Button>
                <div className="flex gap-2">
                  <Button 
                    variant="destructive"
                    onClick={handleRejectRequest}
                  >
                    <X className="mr-1 h-4 w-4" />
                    Reject
                  </Button>
                  <Button 
                    onClick={handleApproveRequest}
                  >
                    <Check className="mr-1 h-4 w-4" />
                    Approve
                  </Button>
                </div>
              </div>
            ) : (
              <Button variant="outline" onClick={() => setShowRequestDialog(false)}>Close</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Patient Details Dialog */}
      <Dialog open={showPatientDialog} onOpenChange={setShowPatientDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Patient Information</DialogTitle>
          </DialogHeader>
          
          {selectedPatient && (
            <div className="py-4 space-y-6">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex items-center justify-center">
                  <div className="bg-primary/10 rounded-full w-24 h-24 flex items-center justify-center">
                    <User className="h-12 w-12 text-primary" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{selectedPatient.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedPatient.email}</p>
                  <p className="text-sm font-mono mt-1">{selectedPatient.wallet}</p>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline">
                      Patient Since: 2025-01-15
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm">
                      <p className="font-medium mb-1">Contact Information</p>
                      <p className="text-muted-foreground">Phone: +1 (555) 123-4567</p>
                      <p className="text-muted-foreground">Address: 123 Main St, Anytown, USA</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm">
                      <p className="font-medium mb-1">Medical Information</p>
                      <p className="text-muted-foreground">Blood Type: A+</p>
                      <p className="text-muted-foreground">Allergies: None</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPatientDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorApprovals;
