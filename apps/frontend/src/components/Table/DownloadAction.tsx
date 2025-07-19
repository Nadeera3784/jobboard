import { Download } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '../Form/Button';
import { ActionProps } from '../../types';
import { Intercom } from '../../utils';
import { HttpStatus } from '../../constants';

export const DownloadAction = ({
  data,
  onDownloadComplete,
}: {
  data: ActionProps;
  onDownloadComplete?: () => void;
}) => {
  const handleDownload = async () => {
    try {
      // First update the application status
      if (data.applicationId) {
        await Intercom.put(
          `/applications/${data.applicationId}/download-resume`,
        );
      }

      // Then download the file using the backend endpoint
      if (data.endpoint) {
        const response = await Intercom.get(data.endpoint, {
          responseType: 'blob',
        });

        if (response.status === HttpStatus.OK) {
          // Create blob URL and trigger download
          const blob = new Blob([response.data], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);

          // Create a temporary link and trigger download
          const link = document.createElement('a');
          link.href = url;
          link.download = data.filename || 'resume.pdf';
          document.body.appendChild(link);
          link.click();

          // Clean up
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);

          toast.success('Resume downloaded successfully!');

          // Refresh the table if callback provided
          if (onDownloadComplete) {
            onDownloadComplete();
          }
        }
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Failed to download resume';
      toast.error(errorMessage);
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleDownload}>
      <Download className="mr-2 h-4 w-4" />
      {data.label}
    </Button>
  );
};
