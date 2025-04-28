import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

interface Props {
  doctorId: string;
  patientId: string;
}

export default function PatientSendRequest({ doctorId, patientId }: Props) {
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    const { error } = await supabase.from('requests').insert({
      patient_id: patientId,
      doctor_id: doctorId,
      message: message
    });

    if (error) {
      toast.error('Failed to send request.');
    } else {
      toast.success('Request sent successfully!');
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col gap-2 p-4">
      <textarea
        placeholder="Write your message..."
        className="border p-2 rounded"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleSubmit} className="bg-blue-600 text-white py-2 rounded">
        Send Request
      </button>
    </div>
  );
}
