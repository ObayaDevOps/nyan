import {
    Box,
    chakra,
    Container,
    Link,
    SimpleGrid,
    Stack,
    Text,
    VisuallyHidden,
    Input,
    Tooltip,
    useClipboard,
    IconButton,
    useColorModeValue,
  } from '@chakra-ui/react';
  import { FaInstagram } from 'react-icons/fa';
  import { BiMailSend } from 'react-icons/bi';
  import { FaPhone } from "react-icons/fa";

  import { IoMdPlanet } from 'react-icons/io';
  import { HiOutlineMail } from 'react-icons/hi';  
  import { RiMapPinLine } from "react-icons/ri";

  import Image from 'next/image'
  import NextLink from 'next/link'

  export default function Footer() {
    const { hasCopied, onCopy } = useClipboard('reservations@yujo.ug');



    return (
      <Box
        bg={useColorModeValue('blackAlpha.900', 'gray.800')}
        pt={2}
        height={'10vh'}
        >


              <Stack direction={'row'} spacing={6} p={2} >
                <Tooltip
                    label={hasCopied ? 'Email Copied!' : 'Copy Email'}
                    closeOnClick={false}
                    hasArrow>
                    <IconButton
                      aria-label="email"
                      color={'red.50'}
                      variant="ghost"
                      size="lg"
                      fontSize="xl"
                      icon={<HiOutlineMail />}
                      _hover={{
                        bg: 'red.500',
                        color: useColorModeValue('white', 'gray.700'),
                      }}
                      onClick={onCopy}
                      isRound
                    />
                  </Tooltip>


                    <IconButton
                    as='a'
                      aria-label="Instagram"
                      variant="ghost"
                      color={'red.50'}
                      size="lg"
                      fontSize="xl"
                      href={'https://www.instagram.com/yujoizakaya/'}
                      icon={<FaInstagram />}
                      _hover={{
                        bg: 'red.500',
                        color: useColorModeValue('white', 'gray.700'),
                      }}
                      isRound
                    />

                  <IconButton
                    as='a'
                      aria-label="Maps"
                      variant="ghost"
                      color={'red.50'}
                      size="lg"
                      fontSize="xl"
                      href={'https://maps.app.goo.gl/RT3ZEuogVDjsqX818'}
                      icon={<RiMapPinLine />}
                      _hover={{
                        bg: 'red.500',
                        color: useColorModeValue('white', 'gray.700'),
                      }}
                      isRound
                    />

                    
                
              </Stack>


      </Box>
    );
  }