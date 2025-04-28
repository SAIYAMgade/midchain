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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Search, X, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { getUserAppointments, findUserById } from '@/lib/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';

const PatientAppointments: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showBookDialog, setShowBookDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [newAppointment, setNewAppointment] = useState({
    doctorId: '',
    date: new Date(),
    time: '',
    reason: ''
  });
  
  if (!user) return null;
  
  const appointments = getUserAppointments(user.id);
  
  // Get all doctors from findUserById, ensuring we get an array that we can filter
  const allUsers = findUserById ? findUserById('all') : [];
  const doctors = Array.isArray(allUsers) ? allUsers.filter(u => u.role === 'doctor') : [];
  
  const availableTimes = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
    '04:00 PM', '04:30 PM'
  ];
  
  const filteredAppointments = appointments.filter(appointment => {
    const doctor = findUserById(appointment.doctorId);
    const doctorName = doctor?.name || '';
    
    return (
      doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  
  const handleCancelAppointment = (appointmentId: string) => {
    // In a real app, this would call an API to cancel the appointment
    toast.success('Appointment cancellation requested');
    setShowCancelDialog(false);
  };
  
  const openCancelDialog = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowCancelDialog(true);
  };
  
  const handleBookAppointment = () => {
    if (!newAppointment.doctorId || !newAppointment.time || !newAppointment.reason) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // In a real app, this would call an API to book the appointment
    toast.success('Appointment request sent successfully');
    setShowBookDialog(false);
    setNewAppointment({
      doctorId: '',
      date: new Date(),
      time: '',
      reason: ''
    });
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Appointments</h1>
        <Button onClick={() => setShowBookDialog(true)}>
          <Calendar className="mr-2 h-4 w-4" />
          Request Appointment
        </Button>
      </div>
      
      <div className="flex items-center mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search appointments..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((appointment) => {
                    const doctor = findUserById(appointment.doctorId);
                    const appointmentDate = new Date(appointment.datetime);
                    const isPast = appointmentDate < new Date();
                    
                    return (
                      <TableRow key={appointment.id}>
                        <TableCell className="font-medium">{doctor?.name}</TableCell>
                        <TableCell>
                          {appointmentDate.toLocaleDateString()}{' '}
                          {appointmentDate.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </TableCell>
                        <TableCell>{appointment.reason}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              appointment.status === 'Accepted' 
                                ? 'bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-900' 
                                : appointment.status === 'Cancelled'
                                  ? 'bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-900'
                                  : appointment.status === 'Completed'
                                    ? 'bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-900'
                                    : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300 dark:hover:bg-yellow-900'
                            }
                          >
                            {appointment.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {!isPast && appointment.status !== 'Cancelled' && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => openCancelDialog(appointment)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="mr-1 h-4 w-4" />
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
                      No appointments found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Appointment</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p className="mb-4">
              Are you sure you want to cancel this appointment?
            </p>
            
            {selectedAppointment && (
              <div className="bg-muted p-4 rounded-md mb-4">
                <p><strong>Doctor:</strong> {findUserById(selectedAppointment.doctorId)?.name}</p>
                <p><strong>Date:</strong> {new Date(selectedAppointment.datetime).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {new Date(selectedAppointment.datetime).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}</p>
                <p><strong>Reason:</strong> {selectedAppointment.reason}</p>
              </div>
            )}
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCancelDialog(false)}>Keep Appointment</Button>
              <Button 
                variant="destructive" 
                onClick={() => selectedAppointment && handleCancelAppointment(selectedAppointment.id)}
              >
                Yes, Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showBookDialog} onOpenChange={setShowBookDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Book New Appointment</DialogTitle>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Doctor</label>
              <Select 
                value={newAppointment.doctorId} 
                onValueChange={(value) => setNewAppointment(prev => ({ ...prev, doctorId: value }))}
              >
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
              <label className="text-sm font-medium">Select Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {newAppointment.date ? format(newAppointment.date, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={newAppointment.date}
                    onSelect={(date) => setNewAppointment(prev => ({ ...prev, date: date || new Date() }))}
                    initialFocus
                    disabled={(date) => date < new Date()}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Time</label>
              <Select 
                value={newAppointment.time} 
                onValueChange={(value) => setNewAppointment(prev => ({ ...prev, time: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a time" />
                </SelectTrigger>
                <SelectContent>
                  {availableTimes.map(time => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Reason for Visit</label>
              <Textarea
                placeholder="Please briefly describe the reason for your appointment"
                value={newAppointment.reason}
                onChange={(e) => setNewAppointment(prev => ({ ...prev, reason: e.target.value }))}
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBookDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleBookAppointment}>
              <Plus className="mr-2 h-4 w-4" />
              Book Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientAppointments;
