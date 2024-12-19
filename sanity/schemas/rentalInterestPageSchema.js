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
  name: 'rentalInterestPage',
  title: 'Rental Interest Page',
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
      name: 'pageName',
      title: 'Page Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'subTitle',
      title: 'Sub Title',
      type: 'string',
    }),

    //Archive Images
    defineField({
        name: 'mainDisplayImage',
        title: 'Main Display Image',
        type: 'image',
        options: {
          hotspot: true,
        },
      }),


    defineField({
      name: 'paragraphText1',
      title: 'Description Paragraph 1',
      type: 'text',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'paragraphText2',
      title: 'Description Paragraph 2 (Optional)',
      type: 'text',
    }),

    defineField({
        name: 'paragraphText3',
        title: 'Description Paragraph 3 (Optional)',
        type: 'text',
      }),

    defineField({
      name: 'contactSocialLink',
      title: 'Contact Social Link (Instagram)',
      type: 'url',
      validation: (rule) => rule.required(),

    }),


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
