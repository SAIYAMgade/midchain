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
  Send,
  Clock,
  FileQuestion
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
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

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
    patientId: 'user1',
    doctorId: 'doc2',
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
    reason: 'Need to check previous lab results'
  }
];

const PatientRequests: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [requestReason, setRequestReason] = useState('');
  
  if (!user) return null;
  
  const allUsers = findUserById ? findUserById('all') : [];
  const doctors = Array.isArray(allUsers) ? allUsers.filter(u => u.role === 'doctor') : [];
  
  const filteredRequests = mockAccessRequests.filter(req => {
    const doctor = findUserById(req.doctorId);
    return doctor?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           req.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
           req.status.toLowerCase().includes(searchTerm.toLowerCase());
  });
  
  const handleSendRequest = () => {
    if (!selectedDoctor) {
      toast.error('Please select a doctor');
      return;
    }
    
    if (!requestReason.trim()) {
      toast.error('Please provide a reason for your request');
      return;
    }
    
    toast.success('Access request sent successfully');
    setShowRequestDialog(false);
    setSelectedDoctor('');
    setRequestReason('');
  };
  
  const handleCancelRequest = (requestId: string) => {
    toast.success('Request canceled successfully');
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
        <FileQuestion className="h-6 w-6" />
        Access Requests
      </h1>
      
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-lg font-medium">My Requests</h2>
        <Button onClick={() => setShowRequestDialog(true)}>
          <Send className="mr-2 h-4 w-4" />
          New Request
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Request History</CardTitle>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search requests..."
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
                  <TableHead>Request Date</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((request) => {
                    const doctor = findUserById(request.doctorId);
                    const isPending = request.status === 'Pending';
                    
                    return (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{doctor?.name}</TableCell>
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
                          {isPending && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleCancelRequest(request.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Cancel
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No requests found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Access</DialogTitle>
            <DialogDescription>
              Send a request to a doctor for access to your medical records
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-2 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Doctor</label>
              <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map(doctor => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      {doctor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Reason for Access Request</label>
              <Textarea 
                placeholder="Explain why you're requesting access..."
                value={requestReason}
                onChange={(e) => setRequestReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRequestDialog(false)}>Cancel</Button>
            <Button onClick={handleSendRequest}>Send Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientRequests;
