import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Camera, X, FileText, Loader2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import jsQR from 'jsqr';
import * as pdfjsLib from 'pdfjs-dist';
import { Html5Qrcode } from 'html5-qrcode';

// Set worker path
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

type ScanMode = 'pdf' | 'camera' | null;
type ItemType = 'strain' | 'zone' | 'charge' | 'plant';

interface ScannedData {
  _id: string;
  strainID?: string;
  zoneID?: string;
  chargeID?: string;
  plantID?: string;
  strainname?: string;
  zonename?: string;
  chargename?: string;
  plantname?: string;
  [key: string]: any;
}

const QRScanner = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanMode, setScanMode] = useState<ScanMode>(null);
  const [scannedData, setScannedData] = useState<{ type: ItemType; id: string } | null>(null);
  const [pdfPreview, setPdfPreview] = useState<string | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const qrScannerRef = useRef<Html5Qrcode | null>(null);
  const scannerDivRef = useRef<HTMLDivElement>(null);

  // Cleanup function for camera
  useEffect(() => {
    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  // Handle modal close
  useEffect(() => {
    if (!isOpen && qrScannerRef.current) {
      qrScannerRef.current.stop().catch(console.error);
    }
  }, [isOpen]);

  const determineType = (data: ScannedData): { type: ItemType; id: string } | null => {
    if (data.strainID || data.strainname) {
      return { type: 'strain', id: data.strainID || data._id };
    }
    if (data.zoneID || data.zonename) {
      return { type: 'zone', id: data.zoneID || data._id };
    }
    if (data.chargeID || data.chargename) {
      return { type: 'charge', id: data.chargeID || data._id };
    }
    if (data.plantID || data.plantname) {
      return { type: 'plant', id: data.plantID || data._id };
    }
    return null;
  };

  const handleQRResult = (result: string) => {
    try {
      const parsedData: ScannedData = JSON.parse(result);
      const typeData = determineType(parsedData);
      
      if (typeData) {
        setScannedData(typeData);
        setScanMode(null);
        toast({
          description: `QR Code scanned successfully! Click 'View ${typeData.type}' to proceed.`,
        });
        // Stop camera if it's running
        if (qrScannerRef.current) {
          qrScannerRef.current.stop().catch(console.error);
        }
      } else {
        throw new Error('Invalid QR code format');
      }
    } catch (error) {
      setScanError('Invalid QR code format. Please try again.');
    }
  };

  const processPDF = async (file: File) => {
    setIsProcessing(true);
    setScanError(null);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const page = await pdf.getPage(1);
      
      // Render PDF page to canvas
      const viewport = page.getViewport({ scale: 2.0 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      if (!context) throw new Error('Cannot get canvas context');
      
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;

      // Save preview
      setPdfPreview(canvas.toDataURL('image/jpeg', 0.8));

      // Get image data for QR scanning
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, canvas.width, canvas.height, {
        inversionAttempts: "dontInvert",
      });

      if (code) {
        handleQRResult(code.data);
      } else {
        setScanError('No QR code found in PDF. Please try another file or use camera mode.');
      }
    } catch (error) {
      console.error('Error processing PDF:', error);
      setScanError('Error processing PDF. Please ensure the file is valid and try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const startCameraScanner = async () => {
    if (!scannerDivRef.current) return;

    try {
      const scanner = new Html5Qrcode("qr-reader");
      qrScannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          handleQRResult(decodedText);
        },
        (errorMessage) => {
          // Ignore continuous scanning errors
          console.log(errorMessage);
        }
      );
    } catch (error) {
      setScanError('Failed to start camera. Please check camera permissions.');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast({
        variant: 'destructive',
        description: 'Please upload a PDF file',
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: 'destructive',
        description: 'File size too large. Please upload a file smaller than 5MB.',
      });
      return;
    }

    await processPDF(file);
  };

  const handleViewItem = () => {
    if (!scannedData) return;

    router.push(`/club/grow/${scannedData.id}`);
    onClose();
  };

  const resetScanner = () => {
    setScanMode(null);
    setScanError(null);
    setPdfPreview(null);
    setScannedData(null);
    if (qrScannerRef.current) {
      qrScannerRef.current.stop().catch(console.error);
    }
  };

  const handleModeSelect = (mode: ScanMode) => {
    setScanMode(mode);
    setScanError(null);
    if (mode === 'camera') {
      startCameraScanner();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        resetScanner();
        onClose();
      }
    }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Scan QR Code</DialogTitle>
          </div>
        </DialogHeader>

        <div className="flex flex-col space-y-4">
          {!scanMode && !scannedData && (
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={() => handleModeSelect('pdf')}
                className="flex flex-col items-center gap-2 h-auto py-4"
              >
                <FileText className="w-6 h-6" />
                <span>Scan PDF</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => handleModeSelect('camera')}
                className="flex flex-col items-center gap-2 h-auto py-4"
              >
                <Camera className="w-6 h-6" />
                <span>Use Camera</span>
              </Button>
            </div>
          )}

          {scanMode === 'pdf' && (
            <>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2"
                disabled={isProcessing}
              >
                <Upload className="w-4 h-4" />
                {isProcessing ? 'Processing...' : 'Upload PDF'}
              </Button>

              <Input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleFileUpload}
              />

              {isProcessing && (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              )}

              {pdfPreview && (
                /* eslint-disable @next/next/no-img-element */
                <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                  <img 
                    src={pdfPreview}
                    alt="PDF Preview"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </>
          )}

          {scanMode === 'camera' && (
            <div className="relative aspect-square w-full overflow-hidden rounded-lg">
              <div id="qr-reader" ref={scannerDivRef} className="w-full h-full" />
            </div>
          )}

          {scanError && (
            <div className="flex flex-col items-center space-y-2 p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-red-600 text-center">{scanError}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={resetScanner}
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Try Again
              </Button>
            </div>
          )}

          {scannedData && (
            <Button onClick={handleViewItem} className="w-full">
              View {scannedData.type.charAt(0).toUpperCase() + scannedData.type.slice(1)}
            </Button>
          )}

          {scanMode && !scannedData && (
            <Button
              variant="ghost"
              onClick={resetScanner}
              className="w-full"
            >
              Change Scan Mode
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRScanner;