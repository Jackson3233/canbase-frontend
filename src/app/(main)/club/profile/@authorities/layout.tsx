import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '../../../../../components/ui/card';
import { FileCheck, Contact } from 'lucide-react';

export default function SettingsAuthoritiesLayout({
  documents,
  contacts
}: {
  documents: React.ReactNode;
  contacts: React.ReactNode;
}) {
  return (
    <div className="w-full p-4">
      <Tabs className="w-full" defaultValue="documents">
        <Card className="w-full mb-4 p-2">
          <TabsList className="w-full h-min bg-white justify-start">
            <TabsTrigger 
              className="items-start flex flex-col gap-[2px] data-[state=active]:text-custom hover:text-custom text-black data-[state=active]:bg-customforeground"
              value="documents">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5" />
                <div className="flex flex-col items-start">
                  <p className="text-sm font-semibold mobile:text-xs">Antragstellung</p>
                  <p className="text-xs tablet:hidden">Nützliche Dokumente für die Anbaulizenz</p>
                </div>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              className="items-start flex flex-col gap-[2px] data-[state=active]:text-custom hover:text-custom text-black data-[state=active]:bg-customforeground"
              value="contacts">
              <div className="flex items-center gap-2">
                <Contact className="w-5 h-5" />
                <div className="flex flex-col items-start">
                  <p className="text-sm font-semibold mobile:text-xs">Kontakt</p>
                  <p className="text-xs tablet:hidden">Behördenkontakte und Ansprechpartner</p>
                </div>
              </div>
            </TabsTrigger>
          </TabsList>
        </Card>
        <TabsContent value="documents">{documents}</TabsContent>
        <TabsContent value="contacts">{contacts}</TabsContent>
      </Tabs>
    </div>
  );
}