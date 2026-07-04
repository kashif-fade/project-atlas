export type Explorer = {
  id: string;
  name: string;
  avatar: string;
  createdAt: number;
  discoveries?: DiscoveryRecord[];
};

export type DiscoveryRecord = {
  id: string;
  title: string;
  fact: string;
  emoji: string;
  foundAt: number;
};