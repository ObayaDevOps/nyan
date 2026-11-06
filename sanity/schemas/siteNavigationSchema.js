import { defineType, defineField } from "sanity";
const required = (rule) => rule.required();
const visible = {
  name: "visible",
  title: "Show on website",
  type: "boolean",
  initialValue: true,
};
const url = {
  name: "url",
  title: "Website address",
  type: "url",
  validation: (rule) => rule.required().uri({ scheme: ["http", "https"] }),
};
export const iconOptions = [
  ["Dining", "FaGlassMartini"],
  ["Art", "FaCameraRetro"],
  ["Energy", "FaLeaf"],
  ["Business", "FaBusinessTime"],
  ["Culture", "FaGamepad"],
  ["Past tenants", "FaUserClock"],
].map(([title, value]) => ({ title, value }));
export default defineType({
  name: "siteNavigation",
  title: "Website navigation",
  type: "document",
  fields: [
    defineField({
      name: "primaryLinks",
      title: "Website pages",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "label",
              title: "Label",
              type: "string",
              validation: required,
            },
            {
              name: "routeKey",
              title: "Page",
              type: "string",
              options: {
                list: [
                  { title: "Home", value: "home" },
                  { title: "Events", value: "events" },
                  { title: "Rental interest", value: "rental" },
                ],
              },
              validation: required,
            },
            visible,
          ],
        },
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "categories",
      title: "Tenant categories — drag to reorder",
      type: "array",
      of: [
        {
          type: "object",
          name: "category",
          fields: [
            {
              name: "label",
              title: "Category name",
              type: "string",
              validation: required,
            },
            {
              name: "iconKey",
              title: "Icon",
              type: "string",
              initialValue: "FaCameraRetro",
              options: { list: iconOptions },
              validation: required,
            },
            visible,
            {
              name: "links",
              title: "Tenants — drag to reorder",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    {
                      name: "label",
                      title: "Tenant name",
                      type: "string",
                      validation: required,
                    },
                    url,
                    visible,
                  ],
                  preview: { select: { title: "label", subtitle: "url" } },
                },
              ],
              validation: (rule) => rule.required().min(1),
            },
          ],
          preview: {
            select: { title: "label", links: "links" },
            prepare: ({ title, links }) => ({
              title,
              subtitle: `${links?.length || 0} tenants`,
            }),
          },
        },
      ],
      validation: required,
    }),
    defineField({
      name: "socialLinks",
      title: "Contact and social links",
      type: "object",
      fields: [
        {
          name: "email",
          type: "string",
          title: "Email",
          validation: (rule) => rule.email(),
        },
        ...["instagram", "facebook", "map"].map((name) => ({
          name,
          title: name === "map" ? "Google Maps" : name,
          type: "url",
          validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
        })),
      ],
    }),
  ],
  preview: {
    prepare: () => ({
      title: "Website navigation",
      subtitle: "Publish to update the website",
    }),
  },
});
