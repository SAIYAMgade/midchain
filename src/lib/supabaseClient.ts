import { createClient } from '@supabase/supabase-js';

export const supabase = createClient('https://gvcydeyeunqgpsdgibxp.supabase.co', 
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2Y3lkZXlldW5xZ3BzZGdpYnhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3NzgyNDQsImV4cCI6MjA2MTM1NDI0NH0.2wxK_SQkO-dw7GxKsvvFDcy4E5Js-2GEaMRWyk-ICZ4');

// src/pages/patient/Requests.tsx
import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Send, Clock, FileQuestion } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogFooter, DialogDescription
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabaseClient';

interface Request {
  id: string;
  patient_id: string;
  doctor_id: string;
  message: string;
  created_at: string;
  status: string;
}

const PatientRequests: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [doctors, setDoctors] = useState<{ id: string; name: string }[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [message, setMessage] = useState('');
  const [requests, setRequests] = useState<Request[]>([]);

  if (!user) return null;
  const patientId = user.id;

  // 1️⃣ Fetch doctors once
  useEffect(() => {
    supabase
      .from('users')
      .select('id, name')
      .eq('role', 'doctor')
      .then(({ data, error }) => {
        if (error) toast.error('Could not load doctors');
        else setDoctors(data || []);
      });
  }, []);

  // 2️⃣ Fetch patient requests once and subscribe
  useEffect(() => {
    let channel: any;
    async function load() {
      const { data, error } = await supabase
        .from<Request>('requests')
        .select('*')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false });
      if (!error) setRequests(data || []);
    }
    load();

    // Realtime subscription
    channel = supabase
      .channel('public:requests')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'requests' }, payload => {
        const req = payload.new as Request;
        if (req.patient_id === patientId) {
          setRequests(r => [req, ...r]);
        }
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [patientId]);

  const handleSend = async () => {
    if (!selectedDoctor) return toast.error('Select a doctor');
    if (!message.trim()) return toast.error('Enter a message');

    const { error } = await supabase.from('requests').insert({
      patient_id: patientId,
      doctor_id: selectedDoctor,
      message,
      status: 'Pending'
    });
    if (error) toast.error('Failed to send request');
    else {
      toast.success('Request sent');
      setShowDialog(false);
      setSelectedDoctor('');
      setMessage('');
    }
  };

  // Filter by doctor name or message
  const filtered = requests.filter(r => {
    const doc = doctors.find(d => d.id === r.doctor_id);
    const name = doc?.name.toLowerCase() || '';
    return (
      name.includes(searchTerm.toLowerCase()) ||
      r.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <FileQuestion className="h-6 w-6" /> Access Requests
      </h1>

      <div className="mb-4 flex justify-between">
        <Button onClick={() => setShowDialog(true)}>
          <Send className="mr-2 h-4 w-4" /> New Request
        </Button>
        <div className="relative">
          <Search className="absolute left-2 top-2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder="Search…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader><CardTitle>My Request History</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Doctor</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length > 0 ? filtered.map(req => {
                const doc = doctors.find(d => d.id === req.doctor_id);
                return (
                  <TableRow key={req.id}>
                    <TableCell>{doc?.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {new Date(req.created_at).toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>{req.message}</TableCell>
                    <TableCell>
                      <Badge>{req.status}</Badge>
                    </TableCell>
                  </TableRow>
                );
              }) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    No requests found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Access Request</DialogTitle>
            <DialogDescription>Choose a doctor and enter your reason.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Doctor</label>
              <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                <SelectTrigger className="w-full"/>
                <SelectContent>
                  {doctors.map(d => (
                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium">Message</label>
              <Textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={4}
                className="w-full"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
            <Button onClick={handleSend}>Send</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientRequests;
