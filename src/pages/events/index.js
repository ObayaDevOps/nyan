import React, { useState }  from 'react';
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
  Button,
  Input,
  InputLeftElement,
  InputGroup,
  Flex,
  SimpleGrid,
  AbsoluteCenter,
  Center,
  Avatar
} from '@chakra-ui/react';

import { FaSearch } from "react-icons/fa";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


import Head from 'next/head'
import NextLink from 'next/link'
import NextImage from 'next/image'


//future improvement: The Exhbition cards should be defined once and can be passed here, will autopopulate the feed
import client from '../../../sanity/lib/client'
import groq from 'groq'

import SideBar from '../../components/sidebar' 
import { BsFileXFill } from 'react-icons/bs';





export const EventAuthor = (props) => {
  return (
    <HStack marginY="4" spacing="0" display="flex" alignItems="center">
      <Text fontWeight="400">{props.authorName}</Text>
      {/* <Text>—</Text> */}
      <Text fontSize='md'>{props.date.toLocaleDateString()}</Text>
    </HStack>
  );
};

const EventTags = (props) => {
  return (
    <Flex marginTop={props.marginTop} ml={-2}>
      {props.tags.map((tag) => {
        return (
          <Box mx={2}>
            <Tag size={'sm'}  p={2} variant="solid" variant='outline' rounded='none' bg='blackAlpha.900' textColor='white' fontFamily='sidebarFont' key={tag}>
              {tag}
            </Tag>
          </Box>
        );
      })}
    </Flex>
  );
};



function EventCard(props) {
  
  const {eventName,authorName, eventStartTime, eventEndTime, eventTagList, eventLandingPageDisplayShortDescription,
    eventLandingDisplayImage, slug
    } = props;  

  const slugLink = '/events/' + slug;

  return (
          <Box w="100%" bg='black'               shadow='2xl'
          >
            <Box overflow="hidden">
              <NextLink href={slugLink} passHref>
                <NextImage
                 src={eventLandingDisplayImage} 
                 height={1824} width={2736}
                 blurDataURL={eventLandingDisplayImage}
                 ></NextImage>
              </NextLink>
            </Box>
            {/* <EventTags tags={eventTagList} marginTop="4"  /> */}

            <Box p={6} mt={-4}>
              <Heading fontSize="xl" marginTop="6" fontFamily='sidebarFont' textColor='white'>
              <NextLink href={slugLink} passHref >
                {/* <Link textDecoration="none" _hover={{ textDecoration: 'none' }}> */}
                  {eventName}
                {/* </Link> */}
              </NextLink>

              <EventAuthor
                name={authorName}
                date={new Date(eventStartTime)}
              />
              </Heading>

              <Text as="p" fontSize="md" marginTop="0" fontFamily='textFont' textColor='white'>
                  {eventLandingPageDisplayShortDescription}
              </Text>
            </Box>

            
          </Box>

  )

}

// tHis is what is exported:
const EventList = ({eventPages}) => {
  const [searchItem, setSearchItem] = useState('')
  const [filteredEvents, setFilteredEvents] = useState(eventPages)
  const [searchDate, setSearchDate] = useState(new Date());
  const [eventSearchPlaceholder, setEventSearchPlaceholder] = useState('Event Search')


  const handleInputChange = (e) => { 
    const searchTerm = e.target.value;
    setSearchItem(searchTerm)

    // console.log(eventPages)

    const filteredItems = eventPages.filter((myEvent) =>

    myEvent.eventName.toLowerCase().includes(searchTerm.toLowerCase()));

    setFilteredEvents(filteredItems)
    // console.log('Filtered')
    // console.log(filteredItems)
  }

  const handleDateSelect = (e) => {
    const selectedDate = e;
    setSearchDate(selectedDate)

    // console.log('Date Select')
    // console.log(new Date(selectedDate) );
    // console.log(myEvent.eventDate);

    const filteredItems = eventPages.filter((myEvent) => {
      const myEventDate = new Date(myEvent.eventDate).setHours(0,0,0,0);
      const mySelectedDate = new Date(selectedDate).setHours(0,0,0,0);

      // console.log('eventDate')
      // console.log(myEvent.eventDate);
      // console.log(new Date(myEvent.eventDate));
      // console.log(myEventDate);
      // console.log(new Date(myEvent.eventDate) >= new Date(selectedDate) )

      return myEventDate >= mySelectedDate 
    })
    
    // console.log('Filtered Items')
    // console.log(filteredItems)

    setFilteredEvents(filteredItems)
  }

  //TODO: apply filtering but on todays date + 7 days
  const handleWeekDateSelect = (e) => {
    const selectedDate = e;
    // setSearchDate(selectedDate)

    // console.log('Date Select')
    // console.log(selectedDate);
  }

  //TODO: apply filtering but on todays date + 31 days
  const handleMonthDateSelect = (e) => {
    const selectedDate = e;
    // setSearchDate(selectedDate)

    // console.log('Date Select')
    // console.log(selectedDate);
  }

  const handleClearAllFilters = () => {
    setFilteredEvents(eventPages);
    setEventSearchPlaceholder('Event Search')
    
  }




  return (
    <Box bgColor={'yellow.300'} 
    border={'1px'}
    borderColor={'yellow.300'}
    minH='100vh'>
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

      {/* The Top Title and search Container */}
      <Container>
        <Heading
                as={'h1'}
                  mb={{base: 2, md: 6}}
                  fontSize={{ base: "5xl",md: "6xl", lg:"7xl",}}
                  minHeight={'1vh'}
                  fontWeight="bold"
                  lineHeight="none"
                  letterSpacing={{base: "normal",md: "tight" }}
                  // color="yellow.900"
                  color="black"
                  textAlign='center'
                >
                  <Text
                    w="full"
                    fontWeight="extrabold"
                    fontFamily='sidebarFont'
                    transition="all .65s ease" _hover={{ transform: 'scale(1.005)', filter: "brightness(120%)", }}
                    pt={8}
                    pb={6}
                  >
                    What's On at Nekosero
                  </Text>
        </Heading>
    

        <InputGroup>
            <InputLeftElement pointerEvents='none'>
              <FaSearch color='black' />
            </InputLeftElement>

            <Input 
              placeholder={eventSearchPlaceholder}
              id="eventSearchInput"
              type="text"
              name="eventSearchInput"
              // focusBorderColor='black' 
              fontFamily='sidebarFont'
              // border='2px'
              // borderColor='black' 
              bgColor='white' 
              rounded={'none'}
              onChange={handleInputChange}
            />

        </InputGroup>

        <HStack>
          <Flex my={2} >
            <DatePicker
              showIcon 
              // inline
              // border='2px'
              placeholderText='Date Range'
              selected={searchDate} 
              onChange={handleDateSelect} />
          </Flex>

          <Flex>
            <Button onClick={handleClearAllFilters}  size={{base: 'sm', md: 'sm'}} textColor='black' rounded='none' fontFamily='sidebarFont' fontSize='sm'>
              Clear
            </Button>
          </Flex>
        </HStack>
      </Container>


      {/* <Flex> */}
        <Center mt={{base: 0, md: 'auto'}} p={{base:0, md:10,  lg:32}} h={'full'} w={'100vw'} >
          <SimpleGrid
              columns={{ base: 1, md: 2, xl: 3 }}
              spacing={'20'}
              mt={16}
              mx={0}>
              {filteredEvents.map((cardInfo, index) => (
                <EventCard {...cardInfo} index={index} key={index} />
              ))}
          </SimpleGrid>
        </Center>
    {/* </Flex> */}

    </Box>
  );
};





//I want the query to return all the info
const query = groq`*[_type == "eventPage"]{
    eventName,
    eventStartTime,
    eventEndTime,
    eventTagList,
    eventLandingPageDisplayShortDescription,
    "eventLandingDisplayImage":eventLandingDisplayImage.asset->url,
    "slug": slug.current
}`


export async function getStaticProps(context) {
  const eventPages = await client.fetch(
      query    
  )

  // console.log("RETURNR2")
  // console.log(eventPages)

  return {
      props: {
        eventPages
      },
      revalidate: 10,

  }
}



export default EventList;