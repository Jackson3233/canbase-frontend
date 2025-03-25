const adjectives = [
  // Entspannt/Chill
  "chillig", "entspannt", "mellow", "relaxed", "peace", "happy", "zen", "easy",
  // Stoned
  "high", "stoned", "blazed", "baked", "lifted", "flying",
  // Positiv
  "lachend", "gluecklich", "freudig", "euphorisch", "mighty", "magic",
  // Cannabis-bezogen
  "gruener", "sticky", "dank", "purple", "hazy", "chronic",
  // Lustig
  "crazy", "wild", "funky", "silly", "witzig", "funny"
];

const nouns = [
  // Cannabis-Slang
  "toker", "blazer", "chief", "buddha", "sensei", "guru",
  // Pflanzen-bezogen
  "blatt", "knospe", "bluete", "samen", "zweig", "pflanze",
  // Orte
  "garten", "jungle", "oase", "paradies", "lounge", "cloud",
  // Tiere (lustig)
  "panda", "koala", "faultier", "otter", "pinguin", "lemur",
  // Cannabis-Kultur
  "hippie", "ranger", "wizard", "yogi", "monk", "master",
  // Snacks
  "munchie", "cookie", "snacker", "burger", "pizza", "donut"
];

export function generateUsername(): string {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 1000);
  
  return `@${adjective}_${noun}${number}`;
}
