import { PackageIcon } from '@sanity/icons'
import { format, parseISO } from 'date-fns'
import { defineField, defineType, defineConfig } from 'sanity'
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
  name: 'eventPage',
  title: 'Event Page',
  icon: PackageIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'eventName',
      title: 'Event Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'subTitle',
      title: 'Sub Title (Optional)',
      type: 'string',
    }),

    //Archive Images
    defineField({
        name: 'eventLandingDisplayImage',
        title: 'Event Landing Display Image',
        type: 'image',
        options: {
          hotspot: true,
        },
      }),
      defineField({
        name: 'sharingUrlImage',
        title: 'Thumbnail Sharing URL Image (should be very small < 30kb and 120x120 square)',
        type: 'image',
        options: {
          hotspot: true,
        },
      }),

      defineField({
        name: 'eventStartTime',
        title: 'Event Start Time',
        type: 'datetime',
        validation: (rule) => rule.required(),
      }), 

      defineField({
        name: 'eventEndTime',
        title: 'Event End Time',
        type: 'datetime',
        validation: (rule) => rule.required(),
      }), 

      //For the Archive Page
      defineField({
        name: 'eventLandingPageDisplayShortDescription',
        title: 'Event Landing Page Display Short Description',
        type: 'string',
        validation: (rule) => rule.required(),
      }),

    defineField({
      name: 'eventParagraphText1',
      title: 'Event Description Paragraph 1',
      type: 'text',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'eventParagraphText2',
      title: 'Event Paragraph Text 2 (Optional)',
      type: 'text',
    }),

    defineField({
      name: 'eventParagraphText3',
      title: 'Event Paragraph Text 3 (Optional)',
      type: 'text',
    }),

    defineField({
      name: 'contactSocialLink',
      title: 'Contact Social Link (Instagram)',
      type: 'url',
      validation: (rule) => rule.required(),

    }),

    //Slug - URL
    {
        title: 'Slug (This will be the url link name - just click generate)',
        name: 'slug',
        type: 'slug',
        options: {
          source: 'title',
          maxLength: 200, // will be ignored if slugify is set
          slugify: input => input
                               .toLowerCase()
                               .replace(/\s+/g, '-')
                               .slice(0, 200)
        }
    }


  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      date: 'date',
      media: 'coverImage',
    },
    prepare({ title, media, author, date }) {
      const subtitles = [
        author && `by ${author}`,
        date && `on ${format(parseISO(date), 'LLL d, yyyy')}`,
      ].filter(Boolean)

      return { title, media, subtitle: subtitles.join(' ') }
    },
  },
})
