'use client'

import React, { ReactNode } from 'react'
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
  BoxProps,
  Stack,
  Tooltip,
  useClipboard,
  FlexProps,
} from '@chakra-ui/react'
import {
  FiMenu,
} from 'react-icons/fi'

import { PiBowlFoodLight } from "react-icons/pi";
import { GiSewingMachine } from "react-icons/gi";
import { FaCameraRetro } from "react-icons/fa";
import { GiBeerBottle } from "react-icons/gi";
import { VscLaw } from "react-icons/vsc";
import { FaCat } from "react-icons/fa";
import { BsBasketFill } from "react-icons/bs";
import { GiMountaintop } from "react-icons/gi";
import { GiEarthAfricaEurope } from "react-icons/gi";
import { GiColombianStatue } from "react-icons/gi";

import { GiStakeHammer } from "react-icons/gi";




import { FaInstagram } from 'react-icons/fa';
import { FaFacebook } from 'react-icons/fa';

import { HiOutlineMail } from 'react-icons/hi';  
import { RiMapPinLine } from "react-icons/ri";


const LinkItems = [
  { name: 'Yujo Izakaya', icon: PiBowlFoodLight, href: 'https://yujo-clean.vercel.app/' },
  { name: 'Buziga Hill', icon: GiSewingMachine, href: 'https://buzigahill.com/' },
  { name: 'AFRPCN Capsule Gallery', icon: GiEarthAfricaEurope, href: 'https://www.afropocene.com/' },
  { name: 'Kanchu with a camera', icon: FaCameraRetro, href: 'https://www.kanchuwithacamera.com/' },
  { name: 'Bananage Brewing Co.', icon: GiBeerBottle, href: 'https://www.banangebrewing.com/' },
  { name: 'T.I.A', icon: GiColombianStatue, href: 'https://www.facebook.com/tiauganda/' },
  { name: 'Silicon Advocates', icon: VscLaw, href: 'https://www.linkedin.com/company/silicon-advocates/' },
  { name: 'Maneki Neko Cafe', icon: FaCat, href: 'https://images.app.goo.gl/BNwT1ZCxPfHg6JPG6' },
  { name: 'Little Kobe Japanese Market', icon: BsBasketFill, href: 'https://www.facebook.com/littlekobejapanesemarket/' },
  { name: 'Mount Royal', icon: GiMountaintop, href: '/#' },

]

export default function SimpleSidebar() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <Box>
      <SidebarContent onClose={() => onClose} display={{ base: 'none', lg: 'block' }} />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full">
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav display={{ base: 'flex', lg:'none' }} onOpen={onOpen} />
      <Box ml={{ base: 0, lg: 60 }} p="4">
        {/* Content */}
        
      </Box>
    </Box>
  )
}


const SidebarContent = ({ onClose, ...rest }) => {

  return (
    <Box>
      <Box
        bg={useColorModeValue('yellow.400', 'gray.900')}
        w={{ base: 'full', lg: '30vw' }}
        pos="fixed"
        h="full"
        overflowY='auto'
        top='0'
        bottom='20'
        {...rest}>
        <Flex h={{base:"16", md: "24",lg:"10"}} alignItems="center" mx="8" justifyContent="space-between">
          <CloseButton display={{ base: 'flex', md: 'flex', lg: 'none' }} onClick={onClose} />
        </Flex>
        {LinkItems.map((link) => (
          <NavItem key={link.name} icon={link.icon} href={link.href}>
            {link.name}
          </NavItem>
        ))}
      </Box>

      <Box 
      {...rest} 
      position='absolute' 
      bottom='0' 
      p={{base: 2, md: 6}} 
      bg={'yellow.400'}
      w={{ base: 'full', lg: '30vw' }}
      
      >
        <SocialsStack />
      </Box>
      

    </Box>
    
  )
}

const SocialsStack = () => {
  const { hasCopied, onCopy } = useClipboard('hello@nekosero.ug');

  return (
    <Flex
    >
      <Stack direction={'row'} spacing={6} p={{base:1, md:2}} >
        <Tooltip
          label={hasCopied ? 'Email Copied!' : 'Copy Email'}
          closeOnClick={false}
          hasArrow>
          <IconButton
            aria-label="email"
            color={'black'}
            variant="ghost"
            size="lg"
            fontSize="xl"
            icon={<HiOutlineMail />}
            _hover={{
              bg: 'yellow.500',
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
            color={'black'}
            size="lg"
            fontSize="xl"
            href={'https://www.instagram.com/nekosero/'}
            icon={<FaInstagram />}
            _hover={{
              bg: 'yellow.500',
              color: useColorModeValue('white', 'gray.700'),
            }}
            isRound
          />

        <IconButton
          as='a'
            aria-label="Facebook"
            variant="ghost"
            color={'black'}
            size="lg"
            fontSize="xl"
            href={'https://maps.app.goo.gl/RT3ZEuogVDjsqX818'}
            icon={<FaFacebook />}
            _hover={{
              bg: 'yellow.500',
              color: useColorModeValue('white', 'gray.700'),
            }}
            isRound
          />      

        <IconButton
          as='a'
            aria-label="Maps"
            variant="ghost"
            color={'black'}
            size="lg"
            fontSize="xl"
            href={'https://maps.app.goo.gl/RT3ZEuogVDjsqX818'}
            icon={<RiMapPinLine />}
            _hover={{
              bg: 'yellow.500',
              color: useColorModeValue('white', 'gray.700'),
            }}
            isRound
          />


        <IconButton
          as='a'
            aria-label="Developer"
            variant="ghost"
            color={'black'}
            size="lg"
            fontSize="xl"
            href={'https://www.dralegawebops.com/'}
            icon={<GiStakeHammer />}
            _hover={{
              bg: 'yellow.500',
              color: useColorModeValue('white', 'gray.700'),
            }}
            isRound
          />


          
      
      </Stack>
  </Flex>
    
  )
}

const NavItem = ({ icon, href, children, ...rest }) => {
  return (
    <Box
      as="a"
      href={href}
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'yellow.500',
          color: 'white',
        }}
        {...rest}>
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            boxSize={{base:'1em', md:'2em'}}
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        <Text 
        fontFamily={'sidebarFont'}
        color='gray.900'
        fontSize={{base:'sm',md:'md', lg: 'md'}}
        _hover={{
          bg: 'yellow.500',
          color: 'white',
        }}
        >
          {children}
        </Text>
      </Flex>
    </Box>
  )
}

const MobileNav = ({ onOpen, ...rest }) => {
  return (
    <Flex
      ml={{ base: 0, lg: 60 }}
      px={{ base: 4, lg: 24 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('yellow.300', 'gray.900')}
      justifyContent="flex-start"
      {...rest}>
      <IconButton
        variant="ghost"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FiMenu />}
      />
    </Flex>
  )
}