import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CanbaseCardHeader } from '../../core/card';
import { ExternalLink, Mail, Phone } from 'lucide-react';

export interface AuthorityItem {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  emailForQuestions?: string;
  website?: string;
  documents?: {
    name: string;
    url: string;
  }[]
}

export type AuthorityCardProps = {
  federalState: string;
  licensingAuthority: AuthorityItem;
  supervisoryAuthority?: AuthorityItem;
  className?: string;
};

function AuthorityCardSection({
  documents,
  ...fields
}: AuthorityItem) {
  const labels: { [key in keyof AuthorityItem]: string } = {
    name: "Name",
    address: "Adresse",
    email: "E-Mail",
    emailForQuestions: "E-Mail für Fragen",
    phone: "Telefon",
    website: "Webseite"
  };
  const t = (field: string) => {
    return labels[field as keyof AuthorityItem];
  }

  const forceProtocolForExternal = (url: string) => {
    if (!url.startsWith('http')) {
      return `https://${url}`;
    }

    return url;
  }

  const renderField = (field: string) => {
    const value = fields[field as keyof typeof fields];
    if (!value) {
      return '-';
    }

    if (field === 'email' || field === 'emailForQuestions') {
      return <a className="flex gap-1 hover:underline" href={`mailto:${value}`}><Mail className="mt-[5px] shrink-0" size={10}/><span className="break-all">{value}</span></a>;
    }
    else if (field === 'phone') {
      return <a className="flex gap-1 hover:underline" href={`tel:${value}`}><Phone className="mt-[5px] shrink-0" size={10}/><span className="break-all">{value}</span></a>;
    }
    else if (field === 'website') {
      return <a className="flex gap-1 hover:underline" target='__blank' href={forceProtocolForExternal(value)}><ExternalLink className="mt-[5px] shrink-0 hover:underline" size={10}/><span className="break-all">{value}</span></a>;
    }

    return <span className="break-word">{value}</span>;
  }

  return <div className="grid grid-cols-2 mobile:grid-cols-1 gap-4">
    {Object.keys(fields).map((field) => (
      <div className="w-full" key={field}>
        <p className="text-xs text-content mb-1">{t(field)}</p>
        <p className="text-sm">{renderField(field)}</p>
      </div>
    ))}
    {!!documents?.length && documents.map(({name, url}) => (
      <div className="w-full" key={name}>
        <p className="text-xs text-content mb-1">{name}</p>
        <p className="text-sm break-all">
        <a className="flex gap-1 hover:underline" href={forceProtocolForExternal(url)} target="_blank">
          <ExternalLink className="mt-[5px] shrink-0" size={10}/>
          <span className="break-all">{url}</span>
        </a>
        </p>
      </div>
    ))}
  </div>
}

export function AuthorityCard({
  federalState,
  licensingAuthority,
  supervisoryAuthority,
  className
}: AuthorityCardProps) {
  return (
    <Card className={className}>
      <CanbaseCardHeader 
        headline={federalState} />
      <CardContent>
        <div>
          <h2 className="font-bold mb-4">Lizenzerteilende Behörde</h2>
          <AuthorityCardSection {...licensingAuthority}></AuthorityCardSection>
        </div>
        {!!supervisoryAuthority && <div className="mt-6">
          <h2 className="font-bold mb-4">Überwachende Behörde</h2>
          <AuthorityCardSection {...supervisoryAuthority}></AuthorityCardSection>
        </div>}
      </CardContent>
    </Card>
  );
}