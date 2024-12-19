import Head from 'next/head'
import Image from 'next/image'
import React, { useRef } from "react";
import { motion } from "framer-motion";


import { Box,AbsoluteCenter, Button,
Flex,Icon,   ScaleFade, VStack


  } from '@chakra-ui/react'

  import { FaBuildingCircleCheck } from "react-icons/fa6";

import { getCloudinaryImage, getCloudinaryImageBlur } from '../util/cloudinaryImageRetreival';
import NextLink from 'next/link'
import SideBar from '../components/sidebar.js' 

import cat from '../../public/'

export default function Home() {
  return (
    <Box  
    minH={'100vh'} 
    bgColor={'yellow.300'} 
    border={'1px'}
    borderColor={'yellow.300'}
    >
      <Head>
        <title>Nekosero | A creative shopping, dining, brewing, fashion, and contemporary arts space</title>
        <meta name="description" content="A creative shopping, dining, brewing, fashion, and contemporary arts space." />
        {/* <meta name="viewport" content="width=device-width, initial-scale=1" /> */}

        <meta property="og:title" content="Nekosero" /> 
        <meta property="og:description" content="A creative Shopping, Dining, Brewing, Fashion, and Contemporary Arts Space" />
        <meta property="og:image" content="../../public/neko-logo.svg" />
        <meta property="og:image:secure_url" content="../../public/neko-logo.svg" />
        <meta property="og:url" content="https://www.nekosero.ug" />
        <meta property="og:type" content="website" />
        
        <link rel="icon" href="/neko-logo.svg" />
      </Head>
      
      <Box>
        <SideBar showNavIcon={false} />
      </Box>

      <Box>
        <AbsoluteCenter mt={{base: 0, md: 0}}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <NextLink href='/#'>
              <Image
                src={getCloudinaryImage('nekosero5.png')} 
                alt="Nekosero Brand Logo"
                width={250}
                height={250}
                priority
                placeholder="blur"
                blurDataURL={getCloudinaryImageBlur('nekosero5.png')}
              />
            </NextLink>
          </motion.div>

          <Flex 
            justify='center'
            mt={20}
          > <VStack>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <Button
                as='a'  
                _hover={{
                  transform: 'scale(1.15)',
                }}
                colorScheme='black' 
                rounded={'none'} 
                fontFamily='sidebarFont' 
                border={'2px'}
                w={'200px'} 
                variant='outline' 
                href='/events'
              >
                See What's On
                <Icon boxSize={4} ml={1} viewBox="0 0 20 20" fill="currentColor">
                            <path
                            fillRule="evenodd"
                            d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z"
                            clipRule="evenodd"
                            />
                        </Icon>                
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <Button
                as='a'  
                _hover={{
                  transform: 'scale(1.15)',
                }}
                colorScheme='black' 
                rounded={'none'} 
                fontFamily='sidebarFont' 
                border={'2px'} 
                variant='outline' 
                w={'200px'} 

                href='/rental-interest'
              >
                Rental Space
                {/* <Icon boxSize={4} ml={1} viewBox="0 0 20 20" fill="currentColor">
                            <path
                            fillRule="evenodd"
                            d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z"
                            clipRule="evenodd"
                            />
                        </Icon>                 */}

                <Box ml={3}>
                  <FaBuildingCircleCheck  size={20} />
                </Box>



              </Button>
            </motion.div>
            </VStack>
          </Flex>
        </AbsoluteCenter>
      </Box>
    </Box>
  )
}
