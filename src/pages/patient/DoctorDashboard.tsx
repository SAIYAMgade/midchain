import DoctorRequests from '@/components/DoctorRequests';

export default function DoctorDashboard() {
  const doctorId = 'doctor-uuid'; // replace with real logged-in doctor id

  return (
    <div className="max-w-lg mx-auto">
      <DoctorRequests doctorId={doctorId} />
    </div>
  );
}
