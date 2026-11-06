import { createClient } from "@sanity/client";
import { writeFile } from "node:fs/promises";
import {
  normalizeNavigation,
  primaryLinks,
  safeUrl,
} from "../src/lib/navigation.mjs";
const args = process.argv.slice(2),
  dataset = args[args.indexOf("--dataset") + 1];
if (!args.includes("--dataset") || !dataset || dataset.startsWith("--"))
  throw new Error(
    "Specify --dataset NAME. Default is dry-run; --apply writes only absent singletons.",
  );
const apply = args.includes("--apply");
if (apply && !process.env.SANITY_MIGRATION_TOKEN)
  throw new Error("SANITY_MIGRATION_TOKEN required for reviewed write run");
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset,
  apiVersion: "2025-02-19",
  useCdn: false,
  token: process.env.SANITY_MIGRATION_TOKEN,
  perspective: "raw",
});
const docs = await client.fetch(
  '*[_type in ["tenantList","rentalInterestPage","siteNavigation"]]|order(_createdAt asc,_id asc)',
);
if (docs.some((d) => d._id.startsWith("drafts.")))
  throw new Error(
    "Draft documents exist. Reconcile editor drafts before migration.",
  );
const categories = docs.filter((d) => d._type === "tenantList");
const icons = new Set([
  "FaGlassMartini",
  "FaCameraRetro",
  "FaLeaf",
  "FaBusinessTime",
  "FaGamepad",
  "FaUserClock",
]);
for (const c of categories) {
  if (!icons.has(c.icon) || !c.title || !c.tenantNameAndURL?.length)
    throw new Error(`Review category ${c._id}`);
  for (const l of c.tenantNameAndURL)
    if (!l.tenantName?.trim() || !safeUrl(l.tenantLink))
      throw new Error(`Invalid link in ${c._id}`);
}
const normalized = normalizeNavigation(null, categories);
const navigation = {
  _id: "siteNavigation",
  _type: "siteNavigation",
  primaryLinks: primaryLinks.map((link) => ({ ...link, _type: "object" })),
  categories: normalized.categories.map((c) => ({
    _type: "category",
    _key: c._key,
    label: c.label,
    iconKey: c.iconKey,
    visible: true,
    links: c.links.map((l, i) => ({
      _type: "object",
      _key: l._key || `${c._key}-${i}`,
      label: l.label,
      url: l.url,
      visible: true,
    })),
  })),
  socialLinks: normalized.socialLinks,
};
const rentals = docs.filter((d) => d._type === "rentalInterestPage");
if (rentals.length > 1)
  throw new Error(
    "Multiple rental documents: select/reconcile canonical content manually",
  );
const targets = [
  navigation,
  ...rentals.map(({ _id, _rev, _createdAt, _updatedAt, ...rest }) => ({
    ...rest,
    _id: "rentalInterestPage",
  })),
];
console.log(
  JSON.stringify(
    {
      mode: apply ? "apply" : "dry-run",
      dataset,
      categories: categories.length,
      targets: targets.map((t) => ({
        id: t._id,
        exists: docs.some((d) => d._id === t._id),
      })),
    },
    null,
    2,
  ),
);
if (apply) {
  const backup = `/tmp/nyan-content-backup-${Date.now()}.json`;
  await writeFile(backup, JSON.stringify(docs, null, 2), { mode: 0o600 });
  console.log("Backup:", backup);
  const transaction = client.transaction();
  for (const target of targets) transaction.createIfNotExists(target);
  await transaction.commit();
}
