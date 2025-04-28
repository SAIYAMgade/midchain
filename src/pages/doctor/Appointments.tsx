import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Check,
  X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { getUserAppointments, findUserById } from '@/lib/mockData';
import { toast } from 'sonner';
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { format, addDays, subDays, startOfWeek, addWeeks, subWeeks, isSameDay } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

// Time slots for appointment scheduling
const timeSlots = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM'
];

const DoctorAppointments = () => {
  const { user } = useAuth();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [currentView, setCurrentView] = useState<'day' | 'week' | 'month'>('week');
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [showAppointmentDetails, setShowAppointmentDetails] = useState(false);
  const [showNewAppointmentDialog, setShowNewAppointmentDialog] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    patientId: '',
    date: new Date(),
    time: '',
    reason: ''
  });
  
  if (!user) return null;
  
  const appointments = getUserAppointments(user.id);
  
  // Get all patients, making sure we get an array from findUserById
  const allUsers = findUserById ? findUserById('all') : [];
  const patients = Array.isArray(allUsers) ? allUsers.filter(u => u.role === 'patient') : [];
  
  // Get appointments for the selected date
  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.datetime);
      return isSameDay(appointmentDate, date);
    });
  };
  
  const selectedDateAppointments = date ? getAppointmentsForDate(date) : [];
  
  // Calculate week days for week view
  const weekDays = Array(7).fill(0).map((_, i) => addDays(currentWeekStart, i));
  
  // Navigation handlers
  const nextWeek = () => setCurrentWeekStart(addWeeks(currentWeekStart, 1));
  const prevWeek = () => setCurrentWeekStart(subWeeks(currentWeekStart, 1));
  const nextDay = () => setDate(date ? addDays(date, 1) : new Date());
  const prevDay = () => setDate(date ? subDays(date, 1) : new Date());
  
  // View detail of an appointment
  const viewAppointmentDetail = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowAppointmentDetails(true);
  };
  
  // Format appointment time for display
  const formatAppointmentTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'h:mm a');
  };
  
  // Update appointment status (Accept/Reject)
  const updateAppointmentStatus = (status: 'Accepted' | 'Cancelled') => {
    if (!selectedAppointment) return;
    
    // In a real app, this would call an API to update the status
    toast.success(`Appointment ${status.toLowerCase()}`);
    setShowAppointmentDetails(false);
  };
  
  // Handle creating a new appointment
  const handleCreateAppointment = () => {
    if (!newAppointment.patientId || !newAppointment.time || !newAppointment.reason) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // In a real app, this would call an API to create the appointment
    toast.success('Appointment created successfully');
    setShowNewAppointmentDialog(false);
    setNewAppointment({
      patientId: '',
      date: new Date(),
      time: '',
      reason: ''
    });
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <CalendarIcon className="h-6 w-6" />
          Appointments
        </h1>
        <Button onClick={() => setShowNewAppointmentDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Appointment
        </Button>
      </div>
      
      <div className="mb-6 flex flex-col lg:flex-row gap-4">
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Calendar</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="border rounded-md p-1">
              <div className="flex justify-between items-center p-3 border-b">
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={currentView === 'day' ? 'bg-primary text-primary-foreground' : ''}
                    onClick={() => setCurrentView('day')}
                  >
                    Day
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={currentView === 'week' ? 'bg-primary text-primary-foreground' : ''}
                    onClick={() => setCurrentView('week')}
                  >
                    Week
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={currentView === 'month' ? 'bg-primary text-primary-foreground' : ''}
                    onClick={() => setCurrentView('month')}
                  >
                    Month
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={currentView === 'day' ? prevDay : prevWeek}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm">
                    {currentView === 'day' && date && format(date, 'MMMM d, yyyy')}
                    {currentView === 'week' && `${format(currentWeekStart, 'MMM d')} - ${format(addDays(currentWeekStart, 6), 'MMM d, yyyy')}`}
                    {currentView === 'month' && date && format(date, 'MMMM yyyy')}
                  </span>
                  <Button variant="ghost" size="icon" onClick={currentView === 'day' ? nextDay : nextWeek}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => {
                    setDate(new Date());
                    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));
                  }}>
                    Today
                  </Button>
                </div>
              </div>
              
              {currentView === 'month' && (
                <div className="p-3">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md pointer-events-auto"
                  />
                </div>
              )}
              
              {currentView === 'week' && (
                <div className="grid grid-cols-7 gap-2 p-3">
                  {weekDays.map((day, i) => {
                    const dayAppointments = getAppointmentsForDate(day);
                    const isToday = isSameDay(day, new Date());
                    const isSelected = date && isSameDay(day, date);
                    
                    return (
                      <div 
                        key={i} 
                        className={cn(
                          "min-h-[120px] rounded-md border p-2 cursor-pointer hover:bg-muted/50 transition-colors",
                          isToday && "border-primary",
                          isSelected && "bg-muted"
                        )}
                        onClick={() => setDate(day)}
                      >
                        <div className={cn(
                          "text-center p-1 rounded-md mb-1",
                          isToday && "bg-primary text-primary-foreground"
                        )}>
                          <div className="text-xs">{format(day, 'EEE')}</div>
                          <div className="text-lg font-semibold">{format(day, 'd')}</div>
                        </div>
                        
                        {dayAppointments.length > 0 ? (
                          <div className="space-y-1">
                            {dayAppointments.slice(0, 3).map((apt, j) => (
                              <div 
                                key={j}
                                className="text-xs px-1 py-0.5 rounded bg-primary/10 truncate"
                                title={`${findUserById(apt.patientId)?.name}: ${apt.reason}`}
                              >
                                {formatAppointmentTime(apt.datetime)} - {findUserById(apt.patientId)?.name.split(' ')[0]}
                              </div>
                            ))}
                            {dayAppointments.length > 3 && (
                              <div className="text-xs text-center text-muted-foreground">
                                +{dayAppointments.length - 3} more
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-xs text-center text-muted-foreground mt-4">
                            No appointments
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              
              {currentView === 'day' && date && (
                <div className="p-3 space-y-2">
                  <div className="text-center p-2 mb-2">
                    <h3 className="font-medium">{format(date, 'EEEE, MMMM d, yyyy')}</h3>
                    {selectedDateAppointments.length > 0 ? (
                      <p className="text-sm text-muted-foreground">{selectedDateAppointments.length} appointment(s) scheduled</p>
                    ) : (
                      <p className="text-sm text-muted-foreground">No appointments scheduled</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    {timeSlots.map((time, i) => {
                      const aptAtTime = selectedDateAppointments.find(apt => 
                        formatAppointmentTime(apt.datetime) === time
                      );
                      
                      return (
                        <div key={i} className="flex items-center border-l-2 border-muted hover:border-primary pl-2">
                          <div className="w-16 text-sm text-muted-foreground">{time}</div>
                          {aptAtTime ? (
                            <div 
                              className="flex-1 ml-2 p-2 rounded bg-primary/10 cursor-pointer hover:bg-primary/20"
                              onClick={() => viewAppointmentDetail(aptAtTime)}
                            >
                              <div className="flex justify-between">
                                <div className="font-medium">{findUserById(aptAtTime.patientId)?.name}</div>
                                <Badge variant={
                                  aptAtTime.status === 'Accepted' ? 'default' :
                                  aptAtTime.status === 'Cancelled' ? 'destructive' : 'outline'
                                }>
                                  {aptAtTime.status}
                                </Badge>
                              </div>
                              <div className="text-sm text-muted-foreground truncate">{aptAtTime.reason}</div>
                            </div>
                          ) : (
                            <div className="flex-1 ml-2 p-2 border border-dashed border-muted rounded text-center hover:border-primary hover:bg-muted/30 cursor-pointer" onClick={() => {
                              setNewAppointment(prev => ({ ...prev, time }));
                              setShowNewAppointmentDialog(true);
                            }}>
                              <span className="text-xs text-muted-foreground">Available</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {date && (
          <Card className="lg:w-72">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Appointments</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <h3 className="font-medium">{format(date, 'EEEE, MMM d')}</h3>
              <p className="text-sm text-muted-foreground mb-4">{selectedDateAppointments.length} appointment(s)</p>
              
              {selectedDateAppointments.length > 0 ? (
                <div className="space-y-3">
                  {selectedDateAppointments.map((apt, i) => {
                    const patient = findUserById(apt.patientId);
                    
                    return (
                      <div 
                        key={i} 
                        className="p-3 rounded-md border hover:border-primary cursor-pointer"
                        onClick={() => viewAppointmentDetail(apt)}
                      >
                        <div className="flex justify-between items-start">
                          <p className="font-medium">{patient?.name}</p>
                          <Badge variant={
                            apt.status === 'Accepted' ? 'default' :
                            apt.status === 'Cancelled' ? 'destructive' : 'outline'
                          } className="ml-1">
                            {apt.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatAppointmentTime(apt.datetime)}</span>
                        </div>
                        <p className="text-sm mt-1 truncate" title={apt.reason}>{apt.reason}</p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  <p>No appointments scheduled</p>
                </div>
              )}
              
              <Button 
                className="w-full mt-4" 
                variant="outline" 
                onClick={() => {
                  setNewAppointment(prev => ({ ...prev, date: date }));
                  setShowNewAppointmentDialog(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                New Appointment
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Appointment Detail Dialog */}
      <Dialog open={showAppointmentDetails} onOpenChange={setShowAppointmentDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
          </DialogHeader>
          
          {selectedAppointment && (
            <div className="py-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-muted rounded-full p-2">
                      <User className="h-4 w-4 text-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{findUserById(selectedAppointment.patientId)?.name}</p>
                      <p className="text-sm text-muted-foreground">Patient</p>
                    </div>
                  </div>
                  <Badge variant={
                    selectedAppointment.status === 'Accepted' ? 'default' :
                    selectedAppointment.status === 'Cancelled' ? 'destructive' : 'outline'
                  }>
                    {selectedAppointment.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 bg-muted/50 p-4 rounded-md">
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">{format(new Date(selectedAppointment.datetime), 'MMMM d, yyyy')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-medium">{format(new Date(selectedAppointment.datetime), 'h:mm a')}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Reason</p>
                    <p>{selectedAppointment.reason}</p>
                  </div>
                </div>
                
                {selectedAppointment.status === 'Requested' && (
                  <div className="flex justify-end gap-2 mt-4">
                    <Button 
                      variant="destructive"
                      onClick={() => updateAppointmentStatus('Cancelled')}
                    >
                      <X className="mr-1 h-4 w-4" />
                      Reject
                    </Button>
                    <Button 
                      onClick={() => updateAppointmentStatus('Accepted')}
                    >
                      <Check className="mr-1 h-4 w-4" />
                      Accept
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAppointmentDetails(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* New Appointment Dialog */}
      <Dialog open={showNewAppointmentDialog} onOpenChange={setShowNewAppointmentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule New Appointment</DialogTitle>
            <DialogDescription>
              Create a new appointment with a patient
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Patient</label>
              <Select 
                value={newAppointment.patientId} 
                onValueChange={(value) => setNewAppointment(prev => ({ ...prev, patientId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map(patient => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newAppointment.date ? format(newAppointment.date, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
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
              <label className="text-sm font-medium">Time</label>
              <Select 
                value={newAppointment.time} 
                onValueChange={(value) => setNewAppointment(prev => ({ ...prev, time: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map(time => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Reason</label>
              <Textarea 
                placeholder="Enter the reason for appointment"
                value={newAppointment.reason}
                onChange={(e) => setNewAppointment(prev => ({ ...prev, reason: e.target.value }))}
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewAppointmentDialog(false)}>Cancel</Button>
            <Button onClick={handleCreateAppointment}>
              <Plus className="mr-1 h-4 w-4" />
              Create Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorAppointments;
