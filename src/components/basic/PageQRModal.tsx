import React from 'react';
import Image from 'next/image';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { jsPDF } from 'jspdf';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type DataType = 'strain' | 'zone' | 'charge' | 'plant';

interface PageQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: DataType;
  data: {
    strainname?: string;
    zonename?: string;
    chargename?: string;
    plantname?: string;
    thc?: string | number;
    cbd?: string | number;
    genetics?: string;
    qrCode: string;
  };
  qrCode: string;
}

const PageQRModal = ({
  isOpen,
  onClose,
  type,
  data,
  qrCode
}: PageQRModalProps) => {
  const getName = () => {
    switch (type) {
      case 'strain':
        return data?.strainname;
      case 'zone':
        return data?.zonename;
      case 'charge':
        return data?.chargename;
      case 'plant':
        return data?.plantname;
      default:
        return 'QR Code';
    }
  };

  const handleDownload = async () => {
    try {
      // Create new PDF document (A4 format)
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: false // Disable compression for better QR readability
      });
      
      // A4 dimensions in mm
      const pageWidth = 210;
      const pageHeight = 297;
      
      // Load the QR code image
      const response = await fetch(qrCode);
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      
      await new Promise((resolve, reject) => {
        const img = new window.Image();
        img.onload = () => {
          try {
            // Calculate dimensions to maintain aspect ratio
            const qrSize = 150; // Increased size for better scanning
            const xPosition = (pageWidth - qrSize) / 2;
            const yPosition = 70; // Adjusted position for larger QR
            
            // Add name information
            const name = getName();
            doc.setFontSize(16);
            doc.text(name || `${type.charAt(0).toUpperCase() + type.slice(1)} QR Code`, pageWidth / 2, 30, { align: 'center' });
            
            // Add details
            doc.setFontSize(12);
            if (data.thc || data.cbd) {
              doc.text(`THC: ${data.thc}% | CBD: ${data.cbd}%`, pageWidth / 2, 45, { align: 'center' });
            }
            if (data.genetics) {
              doc.text(`Genetics: ${data.genetics}`, pageWidth / 2, 55, { align: 'center' });
            }
            
            // Add QR code with high quality
            doc.addImage(img.src, 'PNG', xPosition, yPosition, qrSize, qrSize, undefined, 'FAST');
            
            // Add scanning instructions
            doc.setFontSize(10);
            doc.text(`Scan this QR code to view ${type} details`, pageWidth / 2, yPosition + qrSize + 10, { align: 'center' });
            
            // Save the PDF with appropriate name
            doc.save(`${getName()}-qr-code.pdf`);
            
            // Clean up
            URL.revokeObjectURL(imageUrl);
            resolve(true);
          } catch (error) {
            reject(error);
          }
        };
        
        img.onerror = () => {
          URL.revokeObjectURL(imageUrl);
          reject(new Error('Failed to load image'));
        };
        
        img.src = imageUrl;
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm sm:max-w-md px-4 sm:px-6 py-6 overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-base sm:text-lg">QR Code</DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="flex flex-col space-y-4">
          <div className="text-center space-y-2">
            <h3 className="font-semibold text-sm sm:text-base">{getName()}</h3>
            <div className="text-xs sm:text-sm text-muted-foreground">
              {(data.thc || data.cbd) && (
                <p>THC: {data.thc}% | CBD: {data.cbd}%</p>
              )}
              {data.genetics && <p>{data.genetics}</p>}
            </div>
          </div>

          <div className="relative w-full aspect-square">
            <Image
              src={qrCode}
              alt="QR Code"
              fill
              className="object-contain"
              priority
            />
          </div>

          <Button
            onClick={handleDownload}
            className="w-full flex items-center justify-center gap-2 text-sm sm:text-base py-2 sm:py-3"
          >
            <Download className="w-4 h-4 sm:w-5 sm:h-5" />
            Download QR Code
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PageQRModal;