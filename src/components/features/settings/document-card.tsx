"use client";

import { Card, CardContent } from '@/components/ui/card';
import { DownloadCloud, Eye, EyeOff } from 'lucide-react';
import Image from "next/image";
import { CanbaseCardHeader } from '@/components/core/card';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { PDFViewer } from '@/components/core/pdf-viewer';

export type DocumentCardProps = {
  name: string;
  description: string;
  documents: [{
    name: string;
    description: React.ReactNode;
  }];
  className?: string;
}

export function DocumentCard({
  name,
  description,
  documents,
  className,
}: DocumentCardProps) {
  const [showDocument, setShowDocument] = useState<string>();

  return (
    <Card className={className}>
      <CanbaseCardHeader 
        headline={name}
        description={description} />
      <CardContent>
        <div>
          {documents.map(({name, description}) => (
            <div className="mobile:p-4 p-6 border rounded-lg" key={name}>
              <div 
                className="w-full flex justify-center mobile:gap-4 gap-6">
                <Image
                  src="/assets/images/pdf.svg"
                  className='shrink-0'
                  width={33}
                  height={43}
                  alt="pdf icon"
                />
                <div className="flex-1">
                  <h2 className="text-sm font-semibold mb-1">{name}</h2>
                  <p className="text-xs text-content">{description}</p>
                </div>
                <div className="flex items-center mobile:gap-4 gap-6">
                  <div className="cursor-pointer group">
                    <Eye 
                      className={cn('shrink-0 cursor-pointer', {
                        'hidden group-hover:block tablet:!hidden': showDocument !== name,
                        'group-hover:hidden tablet:!block': showDocument === name
                      })} 
                      size={20}
                      onClick={() => setShowDocument?.(showDocument === name ? undefined : name)} /> 
                    <EyeOff 
                      className={cn('shrink-0 cursor-pointer', {
                        'hidden group-hover:block tablet:!hidden': showDocument === name,
                        'group-hover:hidden tablet:!block': showDocument !== name
                      })} 
                      size={20}
                      onClick={() => setShowDocument?.(showDocument === name ? undefined : name)} />
                  </div>
                  <a 
                    href={`/assets/documents/${name}`} 
                    className="shrink-0"
                    download>
                    <DownloadCloud size={20} />
                  </a>
                </div>
              </div>

              {showDocument === name && (<div className="mobile:pt-4 pt-6 @container">
                <div className="overflow-auto max-h-[calc(141cqw)] w-full rounded-xl p-3 bg-zinc-100">
                  <PDFViewer 
                    url={`/assets/documents/${name}#toolbar=0&navpanes=0&page=0`}
                    className="bg-zinc-100" 
                    />
                </div>
              </div>)}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}