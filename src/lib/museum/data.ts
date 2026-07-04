import { MuseumRoom } from "./types";

export const museumRooms: MuseumRoom[] = [
  {
    id: "ocean-hall",
    name: "Ocean Hall",
    emoji: "🌊",
    discoveries: [
      {
        id: "octopus",
        title: "Octopus",
        emoji: "🐙",
        fact: "Octopuses have three hearts and blue blood."
      }
    ]
  },
  {
    id: "sky-gallery",
    name: "Sky Gallery",
    emoji: "☁️",
    discoveries: [
      {
        id: "rain",
        title: "Rain",
        emoji: "🌧️",
        fact: "Rain starts as tiny droplets that join together in clouds."
      }
    ]
  },
  {
    id: "earth-lab",
    name: "Earth Lab",
    emoji: "🌍",
    discoveries: [
      {
        id: "volcano",
        title: "Volcano",
        emoji: "🌋",
        fact: "Volcanoes release magma from deep inside the Earth."
      }
    ]
  }
];