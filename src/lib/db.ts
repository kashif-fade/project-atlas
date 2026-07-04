import Dexie, { Table } from "dexie";
import type { Explorer } from "./types";

class AtlasDB extends Dexie {
  explorers!: Table<Explorer, string>;

  constructor() {
    super("atlas-db");
    this.version(1).stores({
      explorers: "id, name",
    });
  }
}

export const db = new AtlasDB();