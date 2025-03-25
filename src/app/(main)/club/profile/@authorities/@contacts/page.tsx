import authorities from '@/components/features/settings/authorities.json';
import { AuthorityCard } from '@/components/features/settings/authority-card';

export default function AuthoritiesContactPage() {
  return (
    <div className="grid grid-cols-2 tablet:grid-cols-1 gap-4">
      {authorities.map(a => (
        <div className="w-full" key={a.federalState}>
          <AuthorityCard {...a} className="h-full" />
        </div>
      ))}
    </div>
  );
}