import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import ENV from "../config/env";
import * as schema from "./schema";

const connectionString = ENV.DATABASE_URL;

if (!connectionString) {
	throw new Error("DATABASE_URL environment variable is required");
}

export const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });
