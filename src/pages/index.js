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
        <title>Nekosero</title>
        <meta name="description" content="A bundle of fun" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
