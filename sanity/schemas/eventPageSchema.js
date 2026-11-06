import { defineField, defineType } from "sanity";
// import { muxInput } from 'sanity-plugin-mux-input'

/**
 *
 * Here you'll be able to edit the different fields that appear when you 
 * create or edit a post in the studio.
 * 
 * Here you can see the different schema types that are available:

  https://www.sanity.io/docs/schema-types

 */

export default defineType({
  name: "eventPage",
  title: "Event Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "eventName",
      title: "Event Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subTitle",
      title: "Sub Title (Optional)",
      type: "string",
    }),

    //Archive Images
    defineField({
      name: "eventLandingDisplayImage",
      fields: [{ name: "alt", title: "Image description", type: "string" }],
      title: "Event Landing Display Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "sharingUrlImage",
      title: "Sharing image (optional; use a landscape image)",
      type: "image",
      options: {
        hotspot: true,
      },
    }),

    defineField({
      name: "eventStartTime",
      title: "Event Start Time",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "eventEndTime",
      title: "Event End Time (venue time: Kampala)",
      type: "datetime",
      validation: (rule) =>
        rule
          .required()
          .custom(
            (end, context) =>
              !end ||
              !context.document.eventStartTime ||
              Date.parse(end) > Date.parse(context.document.eventStartTime) ||
              "End must be after start",
          ),
    }),

    //For the Archive Page
    defineField({
      name: "eventLandingPageDisplayShortDescription",
      title: "Event Landing Page Display Short Description",
      type: "string",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "eventParagraphText1",
      title: "Event Description Paragraph 1",
      type: "text",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "eventParagraphText2",
      title: "Event Paragraph Text 2 (Optional)",
      type: "text",
    }),

    defineField({
      name: "eventParagraphText3",
      title: "Event Paragraph Text 3 (Optional)",
      type: "text",
    }),

    defineField({
      name: "contactSocialLink",
      title: "Contact Social Link (Instagram)",
      type: "url",
      validation: (rule) => rule.required(),
    }),

    //Slug - URL
    {
      title: "Slug (This will be the url link name - just click generate)",
      name: "slug",
      type: "slug",
      validation: (rule) => rule.required(),
      options: {
        source: "title",
        maxLength: 200, // will be ignored if slugify is set
        slugify: (input) =>
          input
            .toLowerCase()
            .normalize("NFKD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "")
            .slice(0, 200),
      },
    },
  ],
  preview: {
    select: {
      title: "eventName",
      subtitle: "eventStartTime",
      media: "eventLandingDisplayImage",
    },
  },
});
