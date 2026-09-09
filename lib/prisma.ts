import { config } from "dotenv";
import postgres from "@prisma/orm-postgres/runtime";
import { Pool } from "pg";
import type { Contract } from "../prisma/model/project.d";
import contractJson from "../prisma/model/project.json" with { type: "json" };

config({ path: ".env" });
config({ path: ".env.local", override: true });

const globalForPrisma = globalThis as unknown as {
  prisma?: ReturnType<typeof createPrisma>;
};

function createPrisma() {
  const url = process.env.DATABASE_URL;

  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }

  if (url.startsWith("prisma+postgres://")) {
    return postgres<Contract>({
      contractJson,
      url,
    });
  }

  return postgres<Contract>({
    contractJson,
    pg: new Pool({ connectionString: url }) as never,
  });
}

export const prisma = globalForPrisma.prisma ?? createPrisma();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
