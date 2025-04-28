
import React, { useState, useCallback } from 'react';
import { Upload, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';

interface FileUploadProps {
  onFileUpload?: (file: File) => void;
  allowedTypes?: string[];
  maxSizeMB?: number;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileUpload,
  allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'],
  maxSizeMB = 5
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  }, []);
  
  const validateFile = useCallback((file: File) => {
    if (!allowedTypes.includes(file.type)) {
      toast.error(`File type not supported. Please upload: ${allowedTypes.join(', ')}`);
      return false;
    }
    
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`File too large. Max size: ${maxSizeMB}MB`);
      return false;
    }
    
    return true;
  }, [allowedTypes, maxSizeMB]);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
      }
    }
  }, [validateFile]);
  
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
      }
    }
  }, [validateFile]);
  
  const handleUpload = useCallback(() => {
    if (!file) return;
    
    setUploading(true);
    
    // Simulate file upload
    setTimeout(() => {
      if (onFileUpload) {
        onFileUpload(file);
      }
      toast.success('File uploaded successfully!');
      setFile(null);
      setUploading(false);
    }, 1500);
  }, [file, onFileUpload]);
  
  const handleCancel = useCallback(() => {
    setFile(null);
  }, []);
  
  return (
    <div className="w-full">
      {!file ? (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragging 
              ? 'border-primary bg-primary/5' 
              : 'border-gray-300 dark:border-gray-700'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <Upload className="h-10 w-10 text-muted-foreground mb-2" />
            <h3 className="font-medium">Drag and drop file here</h3>
            <p className="text-sm text-muted-foreground">
              or browse from your computer
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Max file size: {maxSizeMB}MB
            </p>
          </div>
          
          <div className="mt-4">
            <label className="cursor-pointer">
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept={allowedTypes.join(',')}
              />
              <Button type="button" variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Browse Files
              </Button>
            </label>
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">{file.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleCancel}
                  disabled={uploading}
                >
                  <X className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm"
                  onClick={handleUpload}
                  disabled={uploading}
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FileUpload;
