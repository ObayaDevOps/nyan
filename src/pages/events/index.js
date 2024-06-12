import React from 'react';
import {
  Box,
  Heading,
  Link,
  Image,
  Text,
  Divider,
  HStack,
  Tag,
  Wrap,
  WrapItem,
  SpaceProps,
  useColorModeValue,
  useColorMode,
  Container,
  VStack,
  Flex,
  SimpleGrid,
  AbsoluteCenter,
  Avatar
} from '@chakra-ui/react';

import Head from 'next/head'
import NextLink from 'next/link'
import NextImage from 'next/image'


//future improvement: The Exhbition cards should be defined once and can be passed here, will autopopulate the feed
import client from '../../../sanity/lib/client'
import groq from 'groq'

import SideBar from '../../components/sidebar' 





export const EventAuthor = (props) => {
  return (
    <HStack marginTop="2" spacing="2" display="flex" alignItems="center">
      {/* <Image
        borderRadius="full"
        boxSize="40px"
        src={artistPFP}
        alt={`Avatar of ${props.artistName}`}
      /> */}
      <Text fontWeight="medium">{props.authorName}</Text>
      <Text>—</Text>
      <Text>{props.date.toLocaleDateString()}</Text>
    </HStack>
  );
};

const EventTags = (props) => {
  return (
    <HStack spacing={2} marginTop={props.marginTop}>
      {props.tags.map((tag) => {
        return (
          <Tag size={'md'} variant="solid" colorScheme="green" key={tag}>
            {tag}
          </Tag>
        );
      })}
    </HStack>
  );
};



function EventCard(props) {

  // console.log("RETURNR3")
  // console.log(props)


  const {eventName,authorName,eventDate, eventTagList, eventLandingPageDisplayShortDescription,
    eventLandingDisplayImage, slug
    } = props;  



  return (
          <Box w="100%">
            <Box overflow="hidden">
              <NextLink href={slug} passHref>
              {/* <Link textDecoration="none" _hover={{ textDecoration: 'none' }}> */}
                <NextImage
                 src={eventLandingDisplayImage} 
                 height={1824} width={2736}
                 ></NextImage>
              {/* </Link> */}
              </NextLink>
            </Box>
            <EventTags tags={eventTagList} marginTop="3" />
            <Heading fontSize="2xl" marginTop="2">
            <NextLink href={slug} passHref>
              {/* <Link textDecoration="none" _hover={{ textDecoration: 'none' }}> */}
                {eventName}
              {/* </Link> */}
            </NextLink>

            </Heading>
            <Text as="p" fontSize="md" marginTop="2">
                {eventLandingPageDisplayShortDescription}
            </Text>
            <EventAuthor
              name={authorName}
              date={new Date(eventDate)}
            />
          </Box>

  )

}

// tHis is what is exported:

// I need to show that I can access the sanoty ehibition data here too , just like in [slug]
const EventList = ({eventPage}) => {

  return (
    <Flex bgColor={'yellow.300'}  h='calc(120vh)'>
      <Head>
        <title>Events at Nekosero: A creative shopping, dining, brewing, fashion, and contemporary arts space</title>
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
      
      <Heading
              as={'h1'}
                mb={{base: 2, md: 6}}
                fontSize={{ base: "5xl",md: "6xl", lg:"7xl",}}
                minHeight={'1vh'}
                fontWeight="bold"
                lineHeight="none"
                letterSpacing={{base: "normal",md: "tight" }}
                color="yellow.900"
                textAlign='center'
              >
                <Text
                  w="full"
                  // bgClip="text"
                  // bgGradient='linear(to-r, blackAlpha.800, yellow.600)'
                  fontWeight="extrabold"
                  fontFamily='sidebarFont'
                  transition="all .65s ease" _hover={{ transform: 'scale(1.005)', filter: "brightness(120%)", }}
                  pt={8}
                  pb={6}
                >
                  Nekosero Events
                </Text>
      </Heading>
      
      
      
      {/* <Box
        marginTop={{ base: '1', sm: '5' }}
        display="flex"
        flexDirection={{ base: 'column', sm: 'row' }}
        justifyContent="space-between">
      </Box> */}


      <SimpleGrid
          columns={{ base: 1, xl: 2 }}
          spacing={'20'}
          mt={16}
          mx={'auto'}>
          {eventPage.map((cardInfo, index) => (
            <EventCard {...cardInfo} index={index} key={index} />
          ))}
      </SimpleGrid>


        </AbsoluteCenter>
        </Box>


    </Flex>
  );
};





//I wanr the query to return all the info
const query = groq`*[_type == "eventPage"]{
    eventName,
    authorName,
    eventDate,
    eventTagList,
    eventLandingPageDisplayShortDescription,
    "eventLandingDisplayImage":eventLandingDisplayImage.asset->url,
    "slug": slug.current
}`


export async function getStaticProps(context) {
  const eventPage = await client.fetch(
      query    
  )

  console.log("RETURNR2")
  console.log(eventPage)


  return {
      props: {
        eventPage
      },
      revalidate: 10,

  }
}





export default EventList;