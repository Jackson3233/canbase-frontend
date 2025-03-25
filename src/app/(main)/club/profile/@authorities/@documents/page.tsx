import { DocumentCard } from '@/components/features/settings/document-card';

export default function AuthoritiesDocumentsPage() {
  return (
    <div className="grid grid-cols-2 tablet:grid-cols-1 gap-4">
      {/* <DocumentCard 
        className="h-min"
        name="Musterdokumente"
        description="Diese Musterdokumente kannst du bei Bedarf deiner Anbaulizenz-Antragstellung beilegen, falls die zuständige Behörde sie anfordert."
        documents={[{
          name: 'test2.pdf',
          description: 'Bescheinigung für den Transport von Cannabisprodukten nach § 22 Abs. 3 KCanG. (Stand 03.07.2024)'
        }]}/> */}
      <DocumentCard 
        className="h-min"
        name="Offizielle Dokumente"
        description="Diese Dokumente wurden von Behörden bereitgestellt und können von Anbauvereinigungen an ihre Mitglieder ausgehändigt werden."
        documents={[{
          name: 'Infoblatt_Cannabis-Anbauvereinigungen.pdf',
          description: <>
            Dieses Infoblatt wird von der Bundeszentrale für gesundheitliche Aufklärung (BZgA) bereitgestellt und kann von Anbauvereinigungen an Mitglieder ausgehändigt werden. Mehr Informationen auf&nbsp;
            <a href="https://cannabispraevention.de" target="_blank" className="underline">cannabis&shy;praevention.de</a>
          </>
        }]}/>
    </div>
  );
}