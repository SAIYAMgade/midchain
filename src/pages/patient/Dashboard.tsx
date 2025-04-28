
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Download, Calendar, FileText, UserCheck } from 'lucide-react';
import { 
  getUserAppointments, 
  getUserMedicalRecords, 
  getUserNotifications, 
  getUserAccessRequests, 
  findUserById
} from '@/lib/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  const appointments = getUserAppointments(user.id).slice(0, 3);
  const records = getUserMedicalRecords(user.id).slice(0, 3);
  const notifications = getUserNotifications(user.id).slice(0, 3);
  const accessRequests = getUserAccessRequests(user.id);
  
  const upcomingAppointments = appointments.filter(
    apt => new Date(apt.datetime) > new Date()
  );
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Patient Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Medical Records</CardTitle>
            <CardDescription>Your uploaded health records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{records.length}</div>
            <div className="text-sm text-muted-foreground mt-1">Total records</div>
            <Link to="/patient/records">
              <Button className="w-full mt-4" variant="outline">View All Records</Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
            <CardDescription>Your scheduled appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{upcomingAppointments.length}</div>
            <div className="text-sm text-muted-foreground mt-1">Scheduled</div>
            <Link to="/patient/appointments">
              <Button className="w-full mt-4" variant="outline">Manage Appointments</Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Access Requests</CardTitle>
            <CardDescription>Pending record access requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {accessRequests.filter(req => req.status === 'Pending').length}
            </div>
            <div className="text-sm text-muted-foreground mt-1">Pending</div>
            <Link to="/patient/access">
              <Button className="w-full mt-4" variant="outline">Manage Access</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => {
                  const doctor = findUserById(appointment.doctorId);
                  return (
                    <div key={appointment.id} className="flex justify-between items-center border-b pb-3">
                      <div>
                        <p className="font-medium">{doctor?.name}</p>
                        <p className="text-sm text-gray-500">{appointment.reason}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(appointment.datetime).toLocaleDateString()} at{' '}
                          {new Date(appointment.datetime).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                      <Badge
                        className={
                          appointment.status === 'Accepted' 
                            ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                            : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                        }
                      >
                        {appointment.status}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500">
                <p>No upcoming appointments</p>
              </div>
            )}
            <Link to="/patient/appointments">
              <Button variant="link" className="mt-4 p-0">View all appointments</Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Recent Medical Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            {records.length > 0 ? (
              <div className="space-y-4">
                {records.map((record) => (
                  <div key={record.id} className="border-b pb-3">
                    <div className="flex justify-between items-center">
                      <p className="font-medium">{record.fileName}</p>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-gray-400">
                        Uploaded on {new Date(record.uploadDate).toLocaleDateString()}
                      </p>
                      <div className="flex space-x-1">
                        {record.tags.map((tag, i) => (
                          <span 
                            key={i}
                            className="text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-0.5"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500">
                <p>No medical records found</p>
              </div>
            )}
            <Link to="/patient/records">
              <Button variant="link" className="mt-4 p-0">View all records</Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserCheck className="mr-2 h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {notifications.length > 0 ? (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div key={notification.id} className="flex items-start border-b pb-3">
                    <div className="flex-1">
                      <p className={`text-sm ${!notification.read ? 'font-medium' : ''}`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500">
                <p>No recent activity</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatientDashboard;
