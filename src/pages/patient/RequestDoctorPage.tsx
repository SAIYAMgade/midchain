import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import PatientSendRequest from '@/components/PatientSendRequest';

export default function RequestDoctorPage() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);

  const patientId = 'your-patient-id'; // replace with logged-in patient id

  useEffect(() => {
    const fetchDoctors = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'doctor');
      
      if (data) setDoctors(data);
    };

    fetchDoctors();
  }, []);

  if (doctors.length === 0) return <div>Loading doctors...</div>;

  return (
    <div className="max-w-md mx-auto flex flex-col gap-4">
      <h1 className="text-2xl font-bold mb-4">Request a Doctor</h1>
      
      <select
        onChange={(e) => setSelectedDoctor(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="">Select a Doctor</option>
        {doctors.map((doc) => (
          <option key={doc.id} value={doc.id}>
            {doc.name}
          </option>
        ))}
      </select>

      {selectedDoctor && (
        <PatientSendRequest doctorId={selectedDoctor} patientId={patientId} />
      )}
    </div>
  );
}
