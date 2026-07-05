import { MuseumRoom } from "./types";
import { oceanHall } from "./packs/ocean-hall";
import { skyGallery } from "./packs/sky-gallery";
import { earthLab } from "./packs/earth-lab";
import { spaceWing } from "./packs/space-wing";
import { dinosaurHall } from "./packs/dinosaur-hall";
import { animalKingdom } from "./packs/animal-kingdom";

export const museumRooms: MuseumRoom[] = [
  oceanHall,
  skyGallery,
  earthLab,
  spaceWing,
  dinosaurHall,
  animalKingdom,
];

/** Total number of discoveries in the museum */
export const totalDiscoveries = museumRooms.reduce(
  (sum, room) => sum + room.discoveries.length,
  0
);

/** Flat index of every discovery with its room, for lookups and navigation */
export const allDiscoveries = museumRooms.flatMap((room) =>
  room.discoveries.map((discovery) => ({ discovery, room }))
);

export function findDiscovery(id: string) {
  return allDiscoveries.find((x) => x.discovery.id === id);
}
