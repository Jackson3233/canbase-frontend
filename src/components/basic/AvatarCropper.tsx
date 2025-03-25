/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AvatarCropperProps {
  imageFile: File | null;
  onCropComplete: (croppedImage: Blob) => void;
  onCancel: () => void;
  open: boolean;
}

export default function AvatarCropper({
  imageFile,
  onCropComplete,
  onCancel,
  open
}: AvatarCropperProps) {
  const [crop, setCrop] = useState<Crop>({
    unit: 'px',
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  });
  const [imageSrc, setImageSrc] = useState<string>('');
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);
  const [imgDimensions, setImgDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageSrc(reader.result as string);
      });
      reader.readAsDataURL(imageFile);
    }
  }, [imageFile]);

  // Handle image load to set initial dimensions
  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setImgDimensions({ width, height });
    setImageRef(e.currentTarget);

    // Set initial crop area in the center
    const size = Math.min(width, height) / 2;
    const x = (width - size) / 2;
    const y = (height - size) / 2;
    setCrop({
      unit: 'px',
      x,
      y,
      width: size,
      height: size,
    });
  };

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
      <DialogContent className="sm:max-w-[600px] rounded-xl">
        <DialogHeader className="text-left">
          <DialogTitle>Bild zuschneiden</DialogTitle>
        </DialogHeader>
        <div className="mt-4 flex items-center justify-center">
          {imageSrc && (
            <div className="relative" style={{ maxWidth: '100%', maxHeight: '400px' }}>
              <ReactCrop
                crop={crop}
                onChange={(c) => {
                  const size = Math.min(
                    c.width,
                    c.height,
                    imgDimensions.width - c.x,
                    imgDimensions.height - c.y
                  );
                  setCrop({
                    ...c,
                    unit: 'px',
                    width: size,
                    height: size
                  });
                }}
                aspect={1}
                circularCrop
                className="max-h-[400px]"
              >
                <img
                  src={imageSrc}
                  alt="Crop me"
                  onLoad={onImageLoad}
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