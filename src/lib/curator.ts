/** "The Deep Sea" -> "deep sea", for use mid-sentence */
function casual(title: string) {
  return title.replace(/^The /, "").toLowerCase();
}

export function getCuratorGreeting(
  name: string,
  prevVisitAt: number | undefined,
  lastFoundTitle: string | null,
  now: number
) {
  if (!prevVisitAt) {
    return `A new Explorer! The Museum opens its doors for ${name}.`;
  }

  const hoursAway = (now - prevVisitAt) / 36e5;

  if (hoursAway < 8) {
    return lastFoundTitle
      ? `Back so soon, ${name}? The ${casual(lastFoundTitle)} was just telling the others about you.`
      : `Back so soon, ${name}? The Museum is delighted.`;
  }

  if (lastFoundTitle) {
    return `Welcome back, ${name}. Still thinking about the ${casual(lastFoundTitle)}?`;
  }

  return `Welcome back, ${name}. The halls kept your place.`;
}

export function getCuratorMessage(discoveryCount: number, lastRoom: string) {
  if (discoveryCount === 1) {
    return "A first discovery. Every journey begins quietly.";
  }
  if (discoveryCount === 3) {
    return "The Museum is starting to remember your curiosity.";
  }
  if (discoveryCount === 10) {
    return "Ten wonders found. The halls feel brighter when you visit.";
  }
  if (discoveryCount === 25) {
    return "Twenty-five discoveries. You are becoming a true Explorer.";
  }
  if (discoveryCount >= 60) {
    return "You have found every wonder... for now. The Museum is dreaming up new wings.";
  }

  if (lastRoom === "Ocean Hall") {
    return "The Ocean Hall always surprises new Explorers.";
  }
  if (lastRoom === "Sky Gallery") {
    return "Look up often — the Sky Gallery changes every moment.";
  }
  if (lastRoom === "Earth Lab") {
    return "The ground beneath us is busier than it looks.";
  }
  if (lastRoom === "Space Wing") {
    return "In the Space Wing, even the Curator feels small.";
  }
  if (lastRoom === "Dinosaur Hall") {
    return "Listen closely... some say the bones still whisper.";
  }
  if (lastRoom === "Animal Kingdom") {
    return "Every animal here has a secret. Most have several.";
  }

  return "The Museum is listening.";
}
