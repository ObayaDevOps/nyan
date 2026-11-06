import { fixtureClient } from "../../src/lib/fixture-client.mjs";
import { createClient } from "@sanity/client";
import { apiVersion, dataset, projectId } from "../env";
export function getClient(preview = false) {
  if (process.env.NYAN_TEST_MODE === "fixture") return fixtureClient();
  if (!dataset || !projectId)
    throw new Error(
      "Set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET.",
    );
  if (preview && !process.env.SANITY_API_READ_TOKEN)
    throw new Error("Preview is not configured.");
  return createClient({
    apiVersion,
    dataset,
    projectId,
    useCdn: false,
    perspective: preview ? "drafts" : "published",
    token: preview ? process.env.SANITY_API_READ_TOKEN : undefined,
    timeout: 20000,
    maxRetries: 2,
  });
}
