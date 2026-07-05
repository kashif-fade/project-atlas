export type Explorer = {
  id: string;
  name: string;
  avatar: string;
  createdAt: number;
  lastVisitAt?: number;
  discoveries?: DiscoveryRecord[];
};

export type DiscoveryRecord = {
  id: string;
  /** id of the museum Discovery this record came from */
  discoveryId?: string;
  title: string;
  fact: string;
  emoji: string;
  foundAt: number;
};
