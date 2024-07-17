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
  name: 'tenantList',
  title: 'TenantList',
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
      name: 'icon',
      title: 'Icon (Do Not Change!)',
      type: 'string',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'tenantNameAndURL',
      title: 'Tenant List',
      type: 'array',
      of:[{
            type: 'object',
            fields: [
              {
                name: 'tenantName',
                title: 'Tenant Name',
                type: 'string'
              },
              {
                name: 'tenantLink',
                title: 'Tenant Link',
                type: 'url'
              }
            ]
          
          }],
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
