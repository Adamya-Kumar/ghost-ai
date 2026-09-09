import { config } from "dotenv";
import { definePrismaConfig } from "@prisma/cli-engine";
import { defineConfig as ormConfig } from "@prisma/orm-postgres/config";

config({ path: ".env" });
config({ path: ".env.local", override: true });

export default definePrismaConfig({
  orm: ormConfig({
    contract: "./prisma/model/project.prisma",
    db: {
      connection: process.env.DATABASE_URL!,
    },
  }),
});
