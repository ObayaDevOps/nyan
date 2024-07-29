//this will be the template page for all exhibitions

//Link: https://www.sanity.io/blog/build-your-own-blog-with-sanity-and-next-js
//Link: How to get images : https://www.sanity.io/docs/how-queries-work#584ed2426ff5

import {
    Box,
    Container,
    Stack,
    Text,
    Flex,
    VStack,
    Button,
    Heading,
    Icon,
    Center,
    SimpleGrid,
    StackDivider,
    useColorModeValue,
    AbsoluteCenter,
    Image,
    Tag,
    List,
    ListItem,
    HStack,
    Link
  } from '@chakra-ui/react';
import { MdLocalShipping } from 'react-icons/md'

  
import client from '../../../sanity/lib/client'
import groq from 'groq'

import Head from 'next/head'
import NextLink from 'next/link'
import NextImage from 'next/image'

import SideBar from '../../components/sidebar' 



const Event = ({eventPage}) => {

  console.log('EVENT ')
  console.log(eventPage)

  console.log('EVENT START')
  console.log(eventPage.eventStartTime)


  // if( typeof eventPage != 'undefined') {
    const start = new Date(eventPage.eventStartTime);
    const startDateFormatted = start.toLocaleDateString()
    const startHourFormatted = start.toLocaleTimeString()
    
    const end = new Date(eventPage.eventEndTime);
    const endDateFormatted = end.toLocaleDateString()
    const endHourFormatted = end.toLocaleTimeString()
  // }




    return (
      <Box bg="yellow.300"  pb={12}  border={'1px'}  borderColor={'yellow.300'}
      // h='calc(120vh)'
      minH={'100vh'}
      // overflow='scroll' 
            >
        <Head>
          <title>{eventPage.eventName} | Nekosero Events</title>
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
          <SideBar showNavIcon={true}/>
        </Box>


        {/* <Container 
          maxW={{base:'1xl',md:'85vw'}} 
          py={12} 
          rounded='3xl' 
          ml={{base:0,lg: 60}}

        > */}

        <SimpleGrid 
          columns={{base: 1, md: 1, lg: 2}}
          spacing={{ base: 8, md: 10 }}
          py={{ base: 18, md:0, lg:0 }}
        >
          <Box  m={{base: 0, md: 16, lg: 20}} >
            <NextImage
              src={eventPage.eventLandingDisplayImage} 
              height={1824/4} width={2736/4}
              // layout='fill' 
              placeholder="blur"	
              blurDataURL={eventPage.eventLandingDisplayImage}
              alt={eventPage.eventName}
     
                
            ></NextImage>

          </Box>

          <Box mt={{base: 0, md: 20}} ml={{base:0,lg: 0}} >

            <Container maxW={{base:'1xl',md:'75vw'}} >
              <SimpleGrid
                columns={1}
                spacing={{ base: 8, md: 10 }}
                py={{ base: 0, md: 5, lg:8 }}>

                <Stack spacing={{ base: 6, md: 10 }} >
                  <Box as={'header'} >
                    <Heading
                      lineHeight={1.1}
                      fontWeight={600}
                      fontFamily='sidebarFont'
                      fontSize={{ base: '2xl', sm: '4xl', lg: '5xl' }}>
                      {eventPage.eventName}
                    </Heading>
                    <Text
                      color={useColorModeValue('gray.600', 'gray.400')}
                      fontWeight={300}
                      fontFamily='sidebarFont'
                      pt={2}
                      fontSize={{base: 'md', md: 'xl'}}>
                      {eventPage.subTitle}
                    </Text>
                    <Box py={6}>
                      <Text
                        color={useColorModeValue('gray.600', 'gray.400')}
                        fontWeight={300}
                        fontFamily='sidebarFont'
                        fontSize={'md'}>
                        Date: {startDateFormatted}  -  {endDateFormatted}
                      </Text>
                      <Text
                        color={useColorModeValue('gray.600', 'gray.400')}
                        fontWeight={300}
                        fontFamily='sidebarFont'

                        fontSize={'md'}>
                        Time: {startHourFormatted} -  {endHourFormatted}
                      </Text>
                    </Box>
                  </Box>
        
                  <Stack
                    spacing={{ base: 4, sm: 6 }}
                    direction={'column'}
                    >
                      {/* <HStack>
                          <Flex ml={-2}>
                            {eventPage.eventTagList.map((tag) => {
                              return (
                                <Box mx={2}>
                                  <Tag size={'sm'}  p={2} variant="solid" variant='outline'  bg='blackAlpha.900' textColor='white' fontFamily='sidebarFont' key={tag}>
                                    {tag}
                                  </Tag>
                                </Box>
                              );
                            })}
                          </Flex>
                      </HStack> */}


                      <Text
                        textAlign='left'
                        color={useColorModeValue('black', 'gray.400')}
                        fontSize={'2xl'}
                        fontWeight={'300'}
                        fontFamily={'sidebarFont'}
                        
                        >
                          About
                      </Text>

                    <VStack spacing={{ base: 4, sm: 6 }} maxW={'2xl'}>
                      <Text fontFamily='textFont'  fontSize={'lg'} >
                      {eventPage.eventParagraphText1}
                      </Text>
                      <Text fontFamily='textFont' fontSize={'lg'}>
                      {eventPage.eventParagraphText2}
                      </Text>
                      <Text fontFamily='textFont'fontSize={'lg'}>
                      {eventPage.eventParagraphText3}
                      </Text>
                    </VStack>

                    {/* <NextLink href="/info/contact-enquiry"> */}
                        <Button
                        maxW={'2xl'}
                        as="a"
                        href={eventPage.contactSocialLink}
                        // colorScheme="green"
                        variant='outline'
                        display="inline-flex"
                        alignItems="center"
                        justifyContent="center"
                        border={'2px'}
                        rounded='none'
                        fontFamily='sidebarFont'
                        // shadow={'lg'}
                        // textColor={ 'white'}


                        w={{
                            base: "full",
                            sm: "auto",
                        }}
                        mb={{
                            base: 2,
                            sm: 0,
                        }}
                        size="lg"
                        cursor="pointer"
                        // fontFamily="Helvetica"

                        >
                        Get in Contact
                        <Icon boxSize={4} ml={1} viewBox="0 0 20 20" fill="currentColor">
                            <path
                            fillRule="evenodd"
                            d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z"
                            clipRule="evenodd"
                            />
                        </Icon>
                        </Button>
                      {/* </NextLink> */}

                  </Stack>
        
                </Stack>
              </SimpleGrid>
            </Container>
          </Box>
        </SimpleGrid>
      </Box>
    )
}








export async function getStaticPaths() {
    const paths = await client.fetch(
        `*[_type == "eventPage" && defined(slug.current)][].slug.current`
    )

    console.log("paths:")
    console.log(paths) //prints the slug - is this what I need in navbar
    //remember all this routing only works in the 'pages' directory

    //so how to get into navbar ? - navbar cannot be a page

    return {
        paths: paths.map((slug) => ({params: {slug}})),
        fallback: false,
    }
}

const query = groq`*[_type == "eventPage" && slug.current == $slug][0]{
    artistName,
    "eventLandingDisplayImage":eventLandingDisplayImage.asset->url,
    eventStartTime,
    eventEndTime,
    eventName,
    eventParagraphText1,
    eventParagraphText2,
    eventParagraphText3,
    contactSocialLink,
    subTitle,
    title
}`


export async function getStaticProps(context) {
    // It's important to default the slug so that it doesn't return "undefined"
    const { slug = "" } = context.params


    const eventPage = await client.fetch(
        query, { slug }    
    )

    console.log("SLUG PAGE - DETAILS")
    console.log(eventPage)


    return {
        props: {
            eventPage
        },
        revalidate: 10, //In seconds

    }
}





export default Event