import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { dataset, projectId } from "./sanity/env";
import { schema } from "./sanity/schemaTypes";
const singletons = new Set(["siteNavigation", "rentalInterestPage"]);
export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  schema: {
    ...schema,
    templates: (items) => items.filter((i) => !singletons.has(i.schemaType)),
  },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Website content")
          .items([
            S.listItem()
              .title("Website navigation")
              .child(
                S.document()
                  .schemaType("siteNavigation")
                  .documentId("siteNavigation"),
              ),
            S.listItem()
              .title("Rental interest page")
              .child(
                S.document()
                  .schemaType("rentalInterestPage")
                  .documentId("rentalInterestPage"),
              ),
            S.documentTypeListItem("eventPage").title("Events"),
            S.documentTypeListItem("tenantList").title(
              "Legacy categories (migration only)",
            ),
          ]),
    }),
  ],
  document: {
    actions: (actions, context) =>
      singletons.has(context.schemaType)
        ? actions.filter((a) =>
            ["publish", "discardChanges", "restore"].includes(a.action),
          )
        : actions,
  },
});
