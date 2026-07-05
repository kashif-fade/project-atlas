import { MuseumRoom } from "./types";
import { oceanHall } from "./packs/ocean-hall";
import { skyGallery } from "./packs/sky-gallery";
import { earthLab } from "./packs/earth-lab";
import { spaceWing } from "./packs/space-wing";
import { dinosaurHall } from "./packs/dinosaur-hall";
import { animalKingdom } from "./packs/animal-kingdom";
import { humanBody } from "./packs/human-body";
import { inventorsWorkshop } from "./packs/inventors-workshop";
import { longAgoHall } from "./packs/long-ago-hall";
import { tinyWorld } from "./packs/tiny-world";
// VAULT (week-3 "a new wing has opened!" drop) — import from ./vault/ and
// append to museumRooms when it's time:
//   import { plantConservatory } from "./vault/plant-conservatory";
//   import { worldWonders } from "./vault/world-wonders";

export const museumRooms: MuseumRoom[] = [
  oceanHall,
  skyGallery,
  earthLab,
  spaceWing,
  dinosaurHall,
  animalKingdom,
  humanBody,
  inventorsWorkshop,
  longAgoHall,
  tinyWorld,
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
