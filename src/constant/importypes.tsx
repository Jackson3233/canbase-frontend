export const importTypes = [
  {
    id: "skatbank",
    value: (
      <div className="flex flex-col space-y-2">
        <p className="font-medium tablet:text-sm">{`Skatbank`}</p>
        <ol>
          <li className="text-xs text-content">
            {`Beim Skatbank Online Banking anmelden`}
          </li>
          <li className="text-xs text-content">
            {`Zu "Umsatzanzeige" navigieren und "Export" auswählen.`}
          </li>
          <li className="text-xs text-content">
            {`"CSV" als Format wählen und den gewünschten Zeitraum auswählen.`}
          </li>
          <li className="text-xs text-content">
            {`Die Datei herunterladen und hier hochladen. Cannanas wird versuchen
            die Umsätze zu importieren.`}
          </li>
        </ol>
      </div>
    ),
  },
  {
    id: "sparkasse",
    value: (
      <div className="flex flex-col space-y-2">
        <p className="font-medium tablet:text-sm">{`Sparkasse`}</p>
        <ol>
          <li className="text-xs text-content">
            {`Beim GLS Online Banking anmelden`}
          </li>
          <li className="text-xs text-content">
            {`Zu "Umsätze" navigieren und "Export" auswählen.`}
          </li>
          <li className="text-xs text-content">
            {`Den gewünschten Zeitraum auswählen und "Excel (CSV-CAMT V2)" als
            Format wählen.`}
          </li>
          <li className="text-xs text-content">
            {`Die Datei herunterladen und hier hochladen. Cannanas wird versuchen
            die Umsätze zu importieren.`}
          </li>
        </ol>
      </div>
    ),
  },
  {
    id: "commerzbank",
    value: (
      <div className="flex flex-col space-y-2">
        <p className="font-medium tablet:text-sm">{`Commerzbank`}</p>
        <ol>
          <li className="text-xs text-content">
            {`Beim Commerzbank Online Banking anmelden`}
          </li>
          <li className="text-xs text-content">
            {`Zu "Umsatzübersicht" navigieren und "Exportieren" auswählen.`}
          </li>
          <li className="text-xs text-content">
            {`"CSV" als Format wählen und den gewünschten Zeitraum auswählen.`}
          </li>
          <li className="text-xs text-content">
            {`Die Datei herunterladen und hier hochladen. Cannanas wird versuchen
            die Umsätze zu importieren.`}
          </li>
        </ol>
      </div>
    ),
  },
  {
    id: "glsbank",
    value: (
      <div className="flex flex-col space-y-2">
        <p className="font-medium tablet:text-sm">{`GLS Bank`}</p>
        <ol>
          <li className="text-xs text-content">
            {`Beim GLS Online Banking anmelden`}
          </li>
          <li className="text-xs text-content">
            {`Zu "Umsätzen" navigieren und "Export" auswählen.`}
          </li>
          <li className="text-xs text-content">
            {`"CSV" als Format wählen und den gewünschten Zeitraum auswählen.`}
          </li>
          <li className="text-xs text-content">
            {`Die Datei herunterladen und hier hochladen. Cannanas wird versuchen
            die Umsätze zu importieren.`}
          </li>
        </ol>
      </div>
    ),
  },
  {
    id: "mt-940",
    value: (
      <div className="flex flex-col space-y-2">
        <p className="font-medium tablet:text-sm">{`MT-940`}</p>
        <p className="text-xs text-content">
          {`Die MT-940 Datei ist ein Standardformat für den elektronischen
          Kontoauszug. Du kannst die Datei hier hochladen und Cannanas wird
          versuchen die Umsätze zu importieren.`}
        </p>
        <ol>
          <li className="text-xs text-content">{`Beim Online Banking anmelden`}</li>
          <li className="text-xs text-content">
            {`Umsätze oder Kontoauszüge finden`}
          </li>
          <li className="text-xs text-content">
            {`"MT-940" als Format wählen und den gewünschten Zeitraum auswählen.`}
          </li>
          <li className="text-xs text-content">
            {`Die Datei herunterladen und hier hochladen. Cannanas wird versuchen
            die Umsätze zu importieren.`}
          </li>
        </ol>
      </div>
    ),
  },
  {
    id: "other",
    value: (
      <div className="flex flex-col space-y-2">
        <p className="font-medium tablet:text-sm">{`Andere`}</p>
        <p className="text-xs text-content">
          {`Deine Bank ist nicht dabei? Canbase kann versuchen den Kontoauszug zu
          importieren. Sollte das nicht funktionieren melde dich gerne unter
          support@canbase.de und das Canbase Team wird dir helfen.`}
        </p>
      </div>
    ),
  },
];
