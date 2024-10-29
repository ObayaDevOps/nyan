// import { createClient } from 'next-sanity'
import { createClient} from '@sanity/client'

import { apiVersion, dataset, projectId, useCdn } from '../env'

// export const client = createClient({
//   apiVersion,
//   dataset,
//   projectId,
//   useCdn,
// })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "v2023-11-04",
  useCdn: false
  })

  export default client;