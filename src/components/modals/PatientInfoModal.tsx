
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User } from '@/lib/mockData';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface PatientInfoModalProps {
  open: boolean;
  onClose: () => void;
  patient: User | null;
}

const PatientInfoModal: React.FC<PatientInfoModalProps> = ({
  open,
  onClose,
  patient
}) => {
  if (!patient) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle>Patient Information</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={patient.avatar} />
              <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{patient.name}</h3>
              <p className="text-sm text-muted-foreground">{patient.email}</p>
            </div>
          </div>
          
          <div className="grid gap-2">
            <div className="flex justify-between items-center py-2 border-b dark:border-gray-800">
              <span className="text-sm text-muted-foreground">Patient ID</span>
              <span className="font-medium">{patient.id}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b dark:border-gray-800">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                Active
              </Badge>
            </div>
            <div className="flex justify-between items-center py-2 border-b dark:border-gray-800">
              <span className="text-sm text-muted-foreground">Joined Date</span>
              <span className="font-medium">
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PatientInfoModal;
