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
    Link,
    useDisclosure,
    FormControl,
    FormLabel,
    Input,
    useToast,
    Collapse
  } from '@chakra-ui/react';
import { MdLocalShipping } from 'react-icons/md'

  
import client from '../../../sanity/lib/client'
import groq from 'groq'

import Head from 'next/head'
import NextLink from 'next/link'
import NextImage from 'next/image'

import SideBar from '../../components/sidebar' 

import { useState } from 'react';

const Event = ({eventPage}) => {
    const { isOpen, onToggle } = useDisclosure();
    const toast = useToast();
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    });
    
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }
        
        const phoneRegex = /^\+?[\d\s-]{10,}$/;
        if (!formData.phone) {
            newErrors.phone = 'Phone number is required';
        } else if (!phoneRegex.test(formData.phone)) {
            newErrors.phone = 'Please enter a valid phone number';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
//EventName, Name, Email, PhoneNumber
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (validateForm()) {
          let userTypedData = {
            EventName: eventPage.eventName,
            EventDate: startDateFormatted + ' - ' + endDateFormatted,
            EventTime: startHourFormatted + ' - ' + endHourFormatted,
            EventLink: eventPage.contactSocialLink,
            Name: e.target.name.value,
            Email: e.target.email.value,
            PhoneNumber: e.target.phone.value
          }
    
          const res = await fetch('/api/contact', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(userTypedData)
          })


            toast({
                title: "Thanks for registering interest!",
                description: "We'll get back to you soon.",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: 'top',
                render: ({ onClose }) => (
                    <Box
                        p={4}
                        bg="green"
                        border="2px"
                        borderColor="yellow.300"
                        color="white"
                        fontFamily="sidebarFont"
                    >
                        <VStack align="start" spacing={2}>
                            <Text fontWeight={600}>Thanks for registering interest!</Text>
                            <Text>We'll get back to you soon.</Text>
                        </VStack>
                    </Box>
                )
            });
            setFormData({ name: '', email: '', phone: '' });
        } else {
            toast({
                title: "Form validation failed",
                description: "Please check the form and try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: 'top',
                render: ({ onClose }) => (
                    <Box
                        p={4}
                        bg="black"
                        border="2px"
                        borderColor="red.500"
                        color="red.500"
                        fontFamily="sidebarFont"
                    >
                        <VStack align="start" spacing={2}>
                            <Text fontWeight={600}>Form validation failed</Text>
                            <Text>Please check the form and try again.</Text>
                        </VStack>
                    </Box>
                )
            });
        }
    };


    const start = new Date(eventPage.eventStartTime);
    const startDateFormatted = start.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    const startHourFormatted = start.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
    
    const end = new Date(eventPage.eventEndTime);
    const endDateFormatted = end.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    const endHourFormatted = end.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });







    return (
      <Box bg="yellow.300"  
      mt={-5}
      pb={12}  
      // border={'1px'}  
      // borderColor={'yellow.300'}
      // h='calc(120vh)'
      minH={'100vh'}
      // overflow='scroll' 
            >
        <Head>
          <title>{eventPage.eventName} | Nekosero Events</title>
          <meta name="description" content="Nekosero Events"  />
          {/* <meta name="viewport" content="width=device-width, initial-scale=1" /> */}

          <meta property="og:title" content={eventPage.eventName} /> 
          <meta property="og:description" content="Nekosero Events" />
          {/* <meta property="og:image" content="https://res.cloudinary.com/medoptics-image-cloud/image/upload/v1737052416/neko-logo_f5fiok.png" />
          <meta property="og:image:secure_url" content="https://res.cloudinary.com/medoptics-image-cloud/image/upload/v1737052416/neko-logo_f5fiok.png" />
           */}
          <meta property="og:image" content={eventPage.sharingUrlImage} />
          <meta property="og:image:secure_url" content={eventPage.sharingUrlImage} />
         
          
          <meta property="og:image:type" content="image/png" /> 
          {/* <meta property="og:image:width" content="120" />
          <meta property="og:image:height" content="120" /> */}
          <meta property="og:url" content="https://www.nekosero.ug/" />
          <meta property="og:type" content="website" />
          
          {/* <link rel="icon" href="/neko-logo.svg" /> */}
        </Head>

        <Box>
          <SideBar showNavIcon={true}/>
        </Box>


        <SimpleGrid 
          columns={{base: 1, md: 1, lg: 2}}
          spacing={{ base: 8, md: 10 }}
          py={{ base: 18, md:0, lg:0 }}
          mt={{base:-4, md: 0}}
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
                        Date: {startDateFormatted} - {endDateFormatted}
                      </Text>
                      <Text
                        color={useColorModeValue('gray.600', 'gray.400')}
                        fontWeight={300}
                        fontFamily='sidebarFont'

                        fontSize={'md'}>
                        Time: {startHourFormatted} - {endHourFormatted}
                      </Text>
                    </Box>
                  </Box>
        
                  <Stack
                    spacing={{ base: 4, sm: 6 }}
                    direction={'column'}
                    >
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

                        <Button
                        maxW={'2xl'}
                        as="a"
                        href={eventPage.contactSocialLink}
                        variant='outline'
                        display="inline-flex"
                        alignItems="center"
                        justifyContent="center"
                        border={'2px'}
                        rounded='none'
                        fontFamily='sidebarFont'

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


    return {
        paths: paths.map((slug) => ({params: {slug}})),
        fallback: false,
    }
}

const query = groq`*[_type == "eventPage" && slug.current == $slug][0]{
    artistName,
    "eventLandingDisplayImage":eventLandingDisplayImage.asset->url,
    "sharingUrlImage":sharingUrlImage.asset->url,
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

    // console.log("SLUG PAGE - DETAILS")
    // console.log(eventPage)


    return {
        props: {
            eventPage
        },
        revalidate: 10, //In seconds

    }
}





export default Event
