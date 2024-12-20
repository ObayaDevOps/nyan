import React, { useState, useEffect }  from 'react';
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
  Icon,
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

import BoxWithYoutubeBackground from '@/components/boxWithYTBackground';
import {  ChevronDown } from "lucide-react";



import { FaSearch } from "react-icons/fa";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Head from 'next/head'
import NextLink from 'next/link'
import NextImage from 'next/image'

import client from '../../../sanity/lib/client'
import groq from 'groq'

import SideBar from '../../components/sidebar' 
import { BsFileXFill } from 'react-icons/bs';

export const EventDate = (props) => {
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  return (
    <HStack marginY="4" spacing="0" display="flex" alignItems="center">
      <Text fontWeight="400">{props.authorName}</Text>
      <Text fontSize='md'>{formatDate(props.date)}</Text>
    </HStack>
  );
};


function EventCard(props) {
  const {eventName, authorName, eventStartTime, eventEndTime, eventTagList, eventLandingPageDisplayShortDescription,
    eventLandingDisplayImage, slug
  } = props;  

  const slugLink = '/events/' + slug;

  return (
    <Box w="100%" bg='black' shadow='2xl'>
      <Box overflow="hidden">
        <NextLink href={slugLink} passHref>
          <NextImage
           src={eventLandingDisplayImage} 
           height={1824} width={2736}
           placeholder="blur"	
           blurDataURL={eventLandingDisplayImage}
           alt={eventName}
          />
        </NextLink>
      </Box>

      <Box p={6} mt={-4}>
        <Heading fontSize="xl" marginTop="6" fontFamily='sidebarFont' textColor='white'>
          <NextLink href={slugLink} passHref>
            {eventName}
          </NextLink>

          <HStack spacing={{base:16, md: 10, lg:20,  xl: 24}} pt={{base: 2, md: 2}}>
            <EventDate
              name={authorName}
              date={new Date(eventStartTime)}
            />
            <Button
              maxW={'6xl'}
              as="a"
              p={2}
              href={slugLink}
              colorScheme="black"
              display="inline-flex"
              alignItems="center"
              justifyContent="center"
              border={'1px'}
              rounded='none'
              fontFamily='sidebarFont'
              textColor={'white'}
              w={{
                base: "50%",
                sm: "40%",
              }}
              size={{base: 'xs', lg: 'xs'}}
              cursor="pointer"
            >  
              Details
              <Icon boxSize={4} ml={1} viewBox="0 0 20 20" fill="currentColor">
                            <path
                            fillRule="evenodd"
                            d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z"
                            clipRule="evenodd"
                            />
                        </Icon>
            </Button>
          </HStack>
        </Heading>

        <Text as="p" fontSize="md" marginTop={{base: 2, md: 4}} pb={6} fontFamily='textFont' textColor='white'>
          {eventLandingPageDisplayShortDescription}
        </Text>
      </Box>
    </Box>
  )
}

const DateButtons = ({ selectedFilter, onFilterChange }) => {
  const buttons = [
    { label: 'Today', filter: 'today' },
    { label: 'This Weekend', filter: 'weekend' },
    { label: 'This Month', filter: 'month' },
    { label: 'Past Events', filter: 'past' },
    { label: 'All Events', filter: 'all' },
  ];

  return (
    <Container mt={10} mb={{base:6, lg:-12}}>
      <Flex flexWrap="wrap" justifyContent="center" gap={2}>
        {buttons.map((button, index) => (
          <Button
            key={index}
            maxW={'3xl'}
            p={2}
            onClick={() => onFilterChange(button.filter)}
            colorScheme={selectedFilter === button.filter ? "blackAlpha" : "black"}
            bg={selectedFilter === button.filter ? "black" : "transparent"}
            display="inline-flex"
            alignItems="center"
            justifyContent="center"
            border={{base:'1px', md:'2px'}}
            rounded='none'
            fontFamily='sidebarFont'
            textColor={selectedFilter === button.filter ? "white" : "black"}
            w={{
              base: "45%",
              sm: "30%",
            }}
            size={{base: 'xs', lg: 'sm'}}
            cursor="pointer"
          >
            {button.label}
          </Button>
        ))}
      </Flex>
    </Container>
  );
};

const EventList = ({eventPages}) => {
  const [searchItem, setSearchItem] = useState('');
  const [filteredEvents, setFilteredEvents] = useState(eventPages);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [eventSearchPlaceholder, setEventSearchPlaceholder] = useState('Search events...');

  const handleInputChange = (e) => { 
    const searchTerm = e.target.value;
    setSearchItem(searchTerm);
    filterEvents(searchTerm, selectedFilter);
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    filterEvents(searchItem, filter);
  };

  const filterEvents = (searchTerm, filter) => {
    let filtered = eventPages.filter((myEvent) =>
      myEvent.eventName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (filter) {
      case 'today':
        filtered = filtered.filter((event) => {
          const eventDate = new Date(event.eventStartTime);
          return eventDate.toDateString() === today.toDateString();
        });
        break;
      case 'weekend':
        const friday = new Date(today);
        friday.setDate(today.getDate() + (5 - today.getDay() + 7) % 7);
        const sunday = new Date(friday);
        sunday.setDate(friday.getDate() + 2);
        filtered = filtered.filter((event) => {
          const eventDate = new Date(event.eventStartTime);
          return eventDate >= friday && eventDate <= sunday;
        });
        break;
      case 'month':
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        filtered = filtered.filter((event) => {
          const eventDate = new Date(event.eventStartTime);
          return eventDate >= today && eventDate <= endOfMonth;
        });
        break;
      case 'past':
        filtered = filtered.filter((event) => {
          const eventDate = new Date(event.eventStartTime);
          return eventDate < today;
        });
        break;
      case 'all':
        // No additional filtering needed
        break;
    }

    setFilteredEvents(filtered);
  };

  useEffect(() => {
    filterEvents(searchItem, selectedFilter);
  }, [eventPages]);

  const getNoEventsMessage = () => {
    switch (selectedFilter) {
      case 'today':
        return 'No events today';
      case 'weekend':
        return 'No events this weekend';
      case 'month':
        return 'No events this month';
      case 'past':
        return 'No past events';
      default:
        return 'No events found';
    }
  };




  return (
    <Box bgColor={'yellow.300'} marginTop={-5} minH='95vh'>
      <Head>
        <title>Events at Nekosero: A creative shopping, dining, brewing, fashion, and contemporary arts space</title>
        <meta name="description" content="A creative shopping, dining, brewing, fashion, and contemporary arts space." />
        <meta property="og:title" content="Nekosero" /> 
        <meta property="og:description" content="A creative Shopping, Dining, Brewing, Fashion, and Contemporary Arts Space" />
        <meta property="og:image" content="https://res.cloudinary.com/medoptics-image-cloud/image/upload/v1710195370/nekosero5_-_Landscape_Post_1_d9yvq5.png" />
        <meta property="og:image:secure_url" content="https://res.cloudinary.com/medoptics-image-cloud/image/upload/v1710196588/nekosero5_-_Landscape_Post_1_vviwsg.png" />
        <meta property="og:url" content="https://www.nekosero.ug" />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/neko-logo.svg" />
      </Head>

      <Box>
        <SideBar showNavIcon={true} />
      </Box>

      <BoxWithYoutubeBackground 
      // videoId={'dSZQNOvpszQ'}
      videoId={'OgBI2ewu8Yo'}

      OgBI2ewu8Yo
      >
      <Container mt={{base: '60%' ,md: '40%', lg: '15%'}}>
        <Heading
          as={'h1'}
          mb={{base: 2, md: 6}}
          fontSize={{ base: "5xl", md: "6xl", lg:"7xl" }}
          minHeight={'1vh'}
          fontWeight="bold"
          lineHeight="none"
          letterSpacing={{base: "normal", md: "tight" }}
          color="yellow.400"
          textAlign='center'
        >
          <Text
            w="full"
            fontWeight="extrabold"
            fontFamily='sidebarFont'
            transition="all .65s ease" 
            _hover={{ transform: 'scale(1.005)', filter: "brightness(120%)" }}
            
            pt={8}
            pb={6}
          >
            What's On at Nekosero
          </Text>
        </Heading>
      </Container>
    </BoxWithYoutubeBackground>

    <Container>
      <Heading
            as={'h1'}
            mb={{base: 2, md: 6}}
            fontSize={{ base: "5xl", md: "6xl", lg:"7xl" }}
            minHeight={'1vh'}
            fontWeight="bold"
            lineHeight="none"
            letterSpacing={{base: "normal", md: "tight" }}
            color="black"
            textAlign='center'
          >
            <Text
              w="full"
              fontWeight="extrabold"
              fontFamily='sidebarFont'
              transition="all .65s ease" 
              _hover={{ transform: 'scale(1.005)', filter: "brightness(120%)" }}
              
              pt={20}
              pb={6}
            >
              Our Events
            </Text>
          </Heading>

          <InputGroup mb={4}>
              <InputLeftElement pointerEvents='none'>
                <FaSearch color='black' />
              </InputLeftElement>
              <Input 
                placeholder={eventSearchPlaceholder}
                value={searchItem}
                onChange={handleInputChange}
                bg={searchItem ? "white" : "transparent"}
                border={{base: "1px", md: "2px"}}
                borderColor="black"
                color="black"
                _placeholder={{ color: 'black' }}
                _hover={{
                  bg: "rgba(255, 255, 255, 0.1)"
                }}
                _focus={{
                  bg: "white"
                }}
                transition="all 0.3s"
                rounded="none"
                fontFamily="sidebarFont"
              />
            </InputGroup>

          <DateButtons selectedFilter={selectedFilter} onFilterChange={handleFilterChange} />
        </Container>


      <Center mt={{base: 0, md: 'auto'}} p={{base:0, md:10, lg:32}} h={'full'} w={'100vw'}>
        {filteredEvents.length > 0 ? (
          <SimpleGrid
            columns={{ base: 1, md: 2, xl: 3 }}
            spacing={'20'}
            mt={16}
            mx={0}
          >
            {filteredEvents.map((cardInfo, index) => (
              <EventCard {...cardInfo} key={index} />
            ))}
          </SimpleGrid>
        ) : (
          <Box
            mt={16}
            p={8}
            bg="white"
            borderRadius="md"
            textAlign="center"
            shadow="md"
          >
            <Text
              fontSize="xl"
              fontWeight="bold"
              fontFamily="sidebarFont"
              color="black"
            >
              {getNoEventsMessage()}
            </Text>
          </Box>
        )}
      </Center>
    </Box>
  );
};

const query = groq`*[_type == "eventPage"] | order(eventStartTime desc) {
    eventName,
    eventStartTime,
    eventEndTime,
    eventTagList,
    eventLandingPageDisplayShortDescription,
    "eventLandingDisplayImage":eventLandingDisplayImage.asset->url,
    "slug": slug.current
}`

export async function getStaticProps(context) {
  const eventPages = await client.fetch(query)

  return {
    props: {
      eventPages
    },
    revalidate: 10,
  }
}

export default EventList;
