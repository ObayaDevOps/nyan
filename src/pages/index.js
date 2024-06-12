import Head from 'next/head'
import Image from 'next/image'

import { Box,AbsoluteCenter, Button,
Flex,

  } from '@chakra-ui/react'
import { getCloudinaryImage, getCloudinaryImageBlur } from '../util/cloudinaryImageRetreival';

import NextLink from 'next/link'

import SideBar from '../components/sidebar.js' 

export default function Home() {
  return (
    <Box  height={'100vh'} bgColor={'yellow.300'}>
      <Head>
        <title>Nekosero: A creative shopping, dining, brewing, fashion, and contemporary arts space</title>
        <meta name="description" content="A creative shopping, dining, brewing, fashion, and contemporary arts space." />
        {/* <meta name="viewport" content="width=device-width, initial-scale=1" /> */}

        <meta property="og:title" content="Nekosero" /> 
        <meta property="og:description" content="A creative Shopping, Dining, Brewing, Fashion, and Contemporary Arts Space" />
        <meta property="og:image" content="https://res.cloudinary.com/medoptics-image-cloud/image/upload/v1710195370/nekosero5_-_Landscape_Post_1_d9yvq5.png" />
        <meta property="og:image:secure_url" content="https://res.cloudinary.com/medoptics-image-cloud/image/upload/v1710196588/nekosero5_-_Landscape_Post_1_vviwsg.png" />
        <meta property="og:url" content="https://www.nekosero.ug/" />
        <meta property="og:type" content="website" />
        
        <link rel="icon" href="/neko-logo.svg" />
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

            <Flex 
            justify='center'
            mt={20}
            >
              <Button as='a' colorScheme='black'  fontFamily='sidebarFont' variant='outline' href='/events'>
                What's On
              </Button>
            </Flex>
        </AbsoluteCenter>

      </Box>

    </Box>
  )
}
