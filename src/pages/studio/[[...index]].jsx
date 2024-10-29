import Head from 'next/head'
import { NextStudio } from 'next-sanity/studio'
import { NextStudioHead } from 'next-sanity/studio/head'
import config from '../../../sanity.config'

import {
  Box
} from '@chakra-ui/react';

export default function StudioPage() {
  return (
    <Box minHeight={'120vh'} position="fixed" top="0" minWidth={'100vw'} zIndex={9999}>
        <Head>
            <title>Editor Studio | Nekosero </title>
            <meta name="description" content="Nekosero Webpage" />
            <link rel="icon" href="/cat-face.svg" />

            <NextStudioHead />
        </Head>
        
        <NextStudio config={config} />
      </Box>
  )
}