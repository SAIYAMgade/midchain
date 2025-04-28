import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Props {
  doctorId: string;
}

export default function DoctorRequests({ doctorId }: Props) {
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      const { data } = await supabase
        .from('requests')
        .select('*')
        .eq('doctor_id', doctorId);

      if (data) setRequests(data);
    };

    fetchRequests();

    const subscription = supabase
      .channel('realtime:requests')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'requests' }, (payload) => {
        if (payload.new.doctor_id === doctorId) {
          setRequests(prev => [...prev, payload.new]);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [doctorId]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Patient Requests</h2>
      {requests.map((req) => (
        <div key={req.id} className="border p-3 rounded mb-2">
          <p><strong>Message:</strong> {req.message}</p>
          <p className="text-sm text-gray-500">{new Date(req.created_at).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}
