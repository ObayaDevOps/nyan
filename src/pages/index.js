import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'

import { Heading, Flex, Text, Box,AbsoluteCenter, Container, VStack, SimpleGrid, Center, Button, AspectRatio, Alert, AlertIcon, useToast } from '@chakra-ui/react'
import { getCloudinaryImage, getCloudinaryImageBlur } from '../util/cloudinaryImageRetreival';

import Navbar from '../components/navbar'

import Marquee from "react-fast-marquee";


const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <Box>
      <Head>
        <title>Yujo Izakaya</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Box bg={'red.600'} minH={'100vh'}>

        <Box>
          <Navbar />
        </Box>


        <AbsoluteCenter mt={{base: -5, md: 0}}>
          <Image
            src={getCloudinaryImage('yujo9.svg')} 
            alt="Yujo Brand Logo"
            width={300}
            height= {300}
            priority
            placeholder="blur"
            
            blurDataURL={getCloudinaryImageBlur('yujo9.svg')}
            /> 
        </AbsoluteCenter>


        <Flex 
        position='absolute'
        bottom={0}
        >
          <Marquee
            speed={85}
            pauseOnHover
            // gradientColor={'rgba(248, 251, 253, 1)', 'rgba(248, 251, 253, 0)'}
          >
            <Text fontSize={'8xl'} 
            fontFamily={'noto'}
            fontWeight={600}
            color={'white'}
            >
              いらっしゃいませ!   カンパラで最高の日本食レストラン！    
              
            </Text>
          </Marquee>
        </Flex>

        
      </Box>

    </Box>
  )
}
