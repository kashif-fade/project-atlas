export type Discovery = {
  id: string;
  title: string;
  fact: string;
  emoji: string;
};

export type MuseumRoom = {
  id: string;
  name: string;
  emoji: string;
  discoveries: Discovery[];
};