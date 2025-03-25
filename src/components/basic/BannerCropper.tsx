import { useEffect, useState } from 'react';
import Image from "next/image";
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface BannerCropperProps {
  imageFile: File | null;
  onCropComplete: (croppedImage: Blob) => void;
  onCancel: () => void;
  open: boolean;
}

export default function BannerCropper({
  imageFile,
  onCropComplete,
  onCancel,
  open
}: BannerCropperProps) {
  const [crop, setCrop] = useState<Crop>({
    unit: 'px',
    width: 300,
    height: 100,
    x: 0,
    y: 0
  });

  const [imageSrc, setImageSrc] = useState<string>('');
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);
  const [imgDimensions, setImgDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageSrc(reader.result as string);
        // Reset crop when new image is loaded
        const img = new HTMLImageElement();
        img.src = reader.result as string;
        img.onload = () => {
          setImgDimensions({ width: img.width, height: img.height });
          const width = Math.min(img.width, 600); // Max 600px initial crop width
          const height = width / 3; // 3:1 aspect ratio
          setCrop(prev => ({
            ...prev,
            width,
            height,
            x: (img.width - width) / 2,
            y: (img.height - height) / 2
          }));
        };
      });
      reader.readAsDataURL(imageFile);
    }
  }, [imageFile]);

  const getCroppedImg = () => {
    if (!imageRef) return;

    const canvas = document.createElement('canvas');
    const scaleX = imageRef.naturalWidth / imageRef.width;
    const scaleY = imageRef.naturalHeight / imageRef.height;
    
    canvas.width = crop.width;
    canvas.height = crop.height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(
      imageRef,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    canvas.toBlob((blob) => {
      if (blob) {
        onCropComplete(blob);
      }
    }, 'image/jpeg', 1);
  };

  return (
    <Dialog open={open} onOpenChange={() => onCancel()}>
      <DialogContent className="sm:max-w-[1000px] rounded-xl">
        <DialogHeader className="text-left">
          <DialogTitle>Banner zuschneiden</DialogTitle>
        </DialogHeader>
        <div className="mt-4 flex items-center justify-center">
          {imageSrc && (
            <div className="relative" style={{ maxWidth: '100%', maxHeight: '400px' }}>
              <ReactCrop
                crop={crop}
                onChange={(c) => {
                  // Ensure the crop maintains 3:1 aspect ratio
                  const width = c.width;
                  const height = width / 3;
                  setCrop({
                    ...c,
                    unit: 'px',
                    width,
                    height
                  });
                }}
                aspect={3}
                className="max-h-[400px]"
              >
                <Image
                  ref={(ref) => setImageRef(ref)}
                  src={imageSrc}
                  width="0"
                  height="0"
                  alt="Crop me"
                  style={{
                    maxHeight: '400px',
                    width: 'auto',
                    objectFit: 'contain'
                  }}
                />
              </ReactCrop>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onCancel}>
            Abbrechen
          </Button>
          <Button onClick={getCroppedImg}>
            Speichern
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
