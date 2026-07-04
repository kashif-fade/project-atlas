export function getCuratorMessage(discoveryCount: number, lastRoom: string) {
  if (discoveryCount === 1) {
    return "A first discovery. Every journey begins quietly.";
  }

  if (discoveryCount === 3) {
    return "The Museum is starting to remember your curiosity.";
  }

  if (lastRoom === "Ocean Hall") {
    return "The Ocean Hall always surprises new Explorers.";
  }

  if (lastRoom === "Sky Gallery") {
    return "Look up often — the Sky Gallery changes every moment.";
  }

  return "The Museum is listening.";
}