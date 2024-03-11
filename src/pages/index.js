import Head from 'next/head'
import Image from 'next/image'

import { Heading, Text, Box,AbsoluteCenter, Container, VStack, SimpleGrid, Center, Button, AspectRatio, Alert, AlertIcon, useToast } from '@chakra-ui/react'
import { getCloudinaryImage, getCloudinaryImageBlur } from '../util/cloudinaryImageRetreival';

import NextLink from 'next/link'

import SideBar from '../components/sidebar.js' 

export default function Home() {
  return (
    <Box  height={'100vh'} bgColor={'yellow.300'}>
      <Head>
        <title>Nekosero: A creative shopping, dining, brewing, fashion, and contemporary arts space</title>
        <meta name="description" content="Nekosero: A creative shopping, dining, brewing, fashion, and contemporary arts space." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta property="og:title" content="Nekosero" />

        <meta property="og:image" content="https://res.cloudinary.com/medoptics-image-cloud/image/upload/c_pad,w_50,h_89,ar_9:16/v1706709313/nekosero5.png" />
        <meta property="og:image:type" content="png" />
        <meta property="og:image:width" content="100" />
        <meta property="og:image:height" content="50" />
        {/* <meta property="og:image" content="/cat-face.svg"/> */}
        <link rel="icon" href="/cat-face.svg" />
      </Head>
      
      <Box>
        <SideBar />
      </Box>

      <Box>
        <AbsoluteCenter mt={{base: 0, md: 'auto'}} ml={{base:0,lg: 60}}>
          <NextLink href='/#'>
            <Image
              src={getCloudinaryImage('nekosero5.png')} 
              alt="Nekosero Brand Logo"
              width={250}
              height= {250}
              priority
              placeholder="blur"
              
              blurDataURL={getCloudinaryImageBlur('nekosero5.png')}
              />
            </NextLink>
        </AbsoluteCenter>
      </Box>

    </Box>
  )
}
