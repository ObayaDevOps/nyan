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
    Center,
    SimpleGrid,
    useDisclosure,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    useToast,
    Collapse
  } from '@chakra-ui/react';

  
import client from '../../sanity/lib/client'
import groq from 'groq'
import { motion } from "framer-motion";


import Head from 'next/head'


import SideBar from '../components/sidebar' 

import { useState } from 'react';

const RentalInterestPage = ({registerInterestPage}) => {
  console.log("GET STATIC PROPS - INSIDE")
  console.log(registerInterestPage);

  const pageContentSanity = registerInterestPage[0] || [];


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
          <title>{pageContentSanity.title} | Nekosero</title>
          <meta name="description" content="A creative shopping, dining, brewing, fashion, and contemporary arts space." />
          {/* <meta name="viewport" content="width=device-width, initial-scale=1" /> */}

          <meta property="og:title" content="Nekosero Register Rental Interest" /> 
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

        <Box>
          <PageBody pageContent={pageContentSanity}></PageBody>
        </Box>

      </Box>
    )
}


const PageBody = ({pageContent}) => {

    return (
      <Box>
        <PageHeading background={pageContent.mainDisplayImage} title={pageContent.title} subtitle={pageContent.subTitle}/>
        <PageInfo content={pageContent} />

      </Box>
    );
}

const SignUpForm = () => {
  const { isOpen, onToggle } = useDisclosure();
  const toast = useToast();
  
  const [formData, setFormData] = useState({
    businessName: '',
    businessWeb: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    extraInfo: '',
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
      
      if (!formData.clientName.trim()) {
          newErrors.name = 'Name is required';
      } else if (formData.clientName.length < 2) {
          newErrors.name = 'Name must be at least 2 characters';
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.clientEmail) {
          newErrors.email = 'Email is required';
      } else if (!emailRegex.test(formData.clientEmail)) {
          newErrors.email = 'Please enter a valid email';
      }
      
      const phoneRegex = /^\+?[\d\s-]{10,}$/;
      if (!formData.clientPhone) {
          newErrors.phone = 'Phone number is required';
      } else if (!phoneRegex.test(formData.clientPhone)) {
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
          BusinessName: e.target.businessName.value,
          BusinessWebsiteOrSocials: e.target.businessWeb.value,
          ClientName: e.target.clientName.value,
          ClientEmail: e.target.clientEmail.value,
          ClientPhoneNumber: e.target.clientPhone.value,
          ExtraInfo: e.target.extraInfo.value
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
          // setFormData({ name: '', email: '', phone: '' });
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
  return (
    <Box>
    <Button
                        maxW={{base:'2xl', md: '6xl'}}
                        as="a"
                        variant='outline'
                        display="inline-flex"
                        alignItems="center"
                        justifyContent="center"
                        border={'2px'}
                        borderColor='black'
                        rounded='none'
                        fontFamily='sidebarFont'
                        onClick={onToggle}
                        bg={isOpen ? 'black' : 'transparent'}
                        color={isOpen ? 'yellow.300' : 'black'}
                        _hover={{
                          bg: isOpen ? 'black' : 'transparent',
                          color: isOpen ? 'yellow.300' : 'black'
                        }}
                        w={{
                            base: "full",
                            // sm: "auto",
                        }}
                        mb={{
                            base: 2,
                            sm: 0,
                        }}
                        size="lg"
                        cursor="pointer"
                        >
                        Register Interest
                        </Button>

                        <Collapse in={isOpen} animateOpacity>
                        {/* <Text fontFamily='sidebarFont' 
                        fontSize={{base:'md', md:'lg'}}
                        pt={4}
                        >
                          Give us your details and we'll get back to you soon!
                          </Text> */}
                          <Box
                            as="form"
                            onSubmit={handleSubmit}
                            mt={8}
                            p={6}
                            bg="black"
                            borderWidth="2px"
                            borderColor='black'
                            borderRadius="none"
                            maxW={{base:'2xl', md: '6xl'}}
                          >
                            <VStack spacing={4}>
                            <FormControl isRequired isInvalid={errors.name}>
                                <FormLabel 
                                  fontFamily='sidebarFont' 
                                  color="yellow.300"
                                  fontSize={{base: 'md', md: 'lg'}}
                                  fontWeight={500}
                                >
                                  Business Name
                                </FormLabel>
                                <Input 
                                  name="businessName"
                                  value={formData.businessName}
                                  onChange={handleChange}
                                  fontFamily='sidebarFont'
                                  rounded='none'
                                  borderWidth="2px"
                                  borderColor={errors.name ? 'red.500' : 'yellow.300'}
                                  bg="yellow.300"
                                  color="black"
                                  _hover={{ borderColor: 'yellow.400' }}
                                />
                                {errors.name && (
                                  <Text color="red.500" fontSize="sm" mt={1}>
                                    {errors.name}
                                  </Text>
                                )}
                              </FormControl>

                              <FormControl isRequired>
                                <FormLabel 
                                  fontFamily='sidebarFont' 
                                  color="yellow.300"
                                  fontSize={{base: 'md', md: 'lg'}}
                                  fontWeight={500}
                                >
                                  Business Website or Socials
                                </FormLabel>
                                <Input 
                                  name="businessWeb"
                                  value={formData.businessWeb}
                                  onChange={handleChange}
                                  fontFamily='sidebarFont'
                                  rounded='none'
                                  borderWidth="2px"
                                  borderColor={'yellow.300'}
                                  bg="yellow.300"
                                  color="black"
                                  _hover={{ borderColor: 'yellow.400' }}
                                />
                              </FormControl>



                              <FormControl isRequired isInvalid={errors.name}>
                                <FormLabel 
                                  fontFamily='sidebarFont' 
                                  color="yellow.300"
                                  fontSize={{base: 'md', md: 'lg'}}
                                  fontWeight={500}
                                >
                                  Your Name
                                </FormLabel>
                                <Input 
                                  name="clientName"
                                  value={formData.clientName}
                                  onChange={handleChange}
                                  fontFamily='sidebarFont'
                                  rounded='none'
                                  borderWidth="2px"
                                  borderColor={errors.name ? 'red.500' : 'yellow.300'}
                                  bg="yellow.300"
                                  color="black"
                                  _hover={{ borderColor: 'yellow.400' }}
                                />
                                {errors.name && (
                                  <Text color="red.500" fontSize="sm" mt={1}>
                                    {errors.name}
                                  </Text>
                                )}
                              </FormControl>


                              
                              <FormControl isRequired isInvalid={errors.email}>
                                <FormLabel 
                                  fontFamily='sidebarFont' 
                                  color="yellow.300"
                                  fontSize={{base: 'md', md: 'lg'}}
                                  fontWeight={500}
                                >
                                  Contact Email
                                </FormLabel>
                                <Input 
                                  name="clientEmail"
                                  type="email"
                                  value={formData.clientEmail}
                                  onChange={handleChange}
                                  fontFamily='sidebarFont'
                                  rounded='none'
                                  borderWidth="2px"
                                  borderColor={errors.email ? 'red.500' : 'yellow.300'}
                                  bg="yellow.300"
                                  color="black"
                                  _hover={{ borderColor: 'yellow.400' }}
                                />
                                {errors.email && (
                                  <Text color="red.500" fontSize="sm" mt={1}>
                                    {errors.email}
                                  </Text>
                                )}
                              </FormControl>
                              
                              <FormControl isRequired isInvalid={errors.phone}>
                                <FormLabel 
                                  fontFamily='sidebarFont' 
                                  color="yellow.300"
                                  fontSize={{base: 'md', md: 'lg'}}
                                  fontWeight={500}
                                >
                                  Phone Number
                                </FormLabel>
                                <Input 
                                  name="clientPhone"
                                  type="tel"
                                  value={formData.clientPhone}
                                  onChange={handleChange}
                                  fontFamily='sidebarFont'
                                  rounded='none'
                                  borderWidth="2px"
                                  borderColor={errors.phone ? 'red.500' : 'yellow.300'}
                                  bg="yellow.300"
                                  color="black"
                                  _hover={{ borderColor: 'yellow.400' }}
                                />
                                {errors.phone && (
                                  <Text color="red.500" fontSize="sm" mt={1}>
                                    {errors.phone}
                                  </Text>
                                )}
                              </FormControl>

                              <FormControl>
                                <FormLabel 
                                  fontFamily='sidebarFont' 
                                  color="yellow.300"
                                  fontSize={{base: 'md', md: 'lg'}}
                                  fontWeight={500}
                                >
                                  Anything else you would like us to know?
                                </FormLabel>
                                {/* <Input 
                                  name="extraInfo"
                                  value={formData.extraInfo}
                                  onChange={handleChange}
                                  fontFamily='sidebarFont'
                                  rounded='none'
                                  borderWidth="2px"
                                  borderColor={'yellow.300'}
                                  bg="yellow.300"
                                  color="black"
                                  _hover={{ borderColor: 'yellow.400' }}
                                /> */}
                                <Textarea
                                  name="extraInfo"
                                  value={formData.extraInfo}
                                  onChange={handleChange}
                                  fontFamily='sidebarFont'
                                  rounded='none'
                                  borderWidth="2px"
                                  borderColor={'yellow.300'}
                                  bg="yellow.300"
                                  color="black"
                                  _hover={{ borderColor: 'yellow.400' }}
                                />

                                
                              </FormControl>
                              
                              <Button
                                type="submit"
                                variant='outline'
                                border={'2px'}
                                rounded='none'
                                fontFamily='sidebarFont'
                                w="full"
                                mt={4}
                                borderColor="yellow.300"
                                color="yellow.300"
                                _hover={{
                                  bg: 'yellow.300',
                                  color: 'black'
                                }}
                              >
                                Submit
                              </Button>
                            </VStack>
                          </Box>
                        </Collapse> 
  </Box>
  )
}

const PageInfo = ({content}) => {
  return (
    <Container maxW={{base: 'sm', md:'6xl'}}>
        <SimpleGrid
          columns={1}
          spacing={{ base: 8, md: 10 }}
          py={{ base: 18, md: 24, lg:0 }}>
          <Flex>

          </Flex>
          <Stack spacing={{ base: 6, md: 10 }}>
            <Stack
              spacing={{ base: 4, sm: 6, lg: 20 }}
              direction={'column'}
              >
              <VStack spacing={{ base: 4, sm: 6 }}>
                <Heading
                py={20}
                lineHeight={1.1}
                fontWeight={600}
                fontFamily='sidebarFont'
                fontSize={{ base: '4xl', sm: '4xl', lg: '5xl' }}>
                {content.pageName}
                </Heading>

                <Box pb={{base: 20,lg:12}}>
                <Text fontSize={{base:'2xl',md: '2xl'}}
                  fontFamily='textFont'
                >
                  {content.paragraphText1}
                </Text>
                <Text fontSize={{base:'2xl',md: '2xl'}} 
                pt={{base:10, lg: 6}} fontFamily='textFont'  >
                  {content.paragraphText2}
                </Text>

                <Text fontSize={{base:'2xl',md: '2xl'}} 
                pt={{base:10, lg: 6}} fontFamily='textFont'  >
                  {content.paragraphText3}               
                </Text>
                </Box>


              </VStack>  
              <Box pb={24}>
                  <SignUpForm />
              </Box>          
            </Stack>
          </Stack>
        </SimpleGrid>
    </Container>
  )
}

const PageHeading = ({background, title, subtitle}) => {
  return (
    <Box
    minHeight='100vh'
    bgSize="cover" 
    bgPosition="center" 
    bgAttachment="fixed" 
    backgroundImage={background}
  >
    <Center p={{ base: 1, md: 10 }}>
      <VStack>
      <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
      <Heading
          as="h1"
          size={{ base: "3xl", lg: "4xl" }}
          textAlign="center"
          color="white"
          pt={{ base: 20, md: 48 }}
          pb={{ base: 5 }}
          fontFamily="sidebarFont"
      >
          {title}
      </Heading>
      <Heading
          as="h2"
          maxW={{base:'xl', md: '3xl'}}
          size={{ base: "md", lg: "lg" }}
          textAlign="center"
          color="white"
          // pt={{ base: 10, md: 64 }}
          pb={{ base: 5 }}
          fontFamily="sidebarFont"
      >
          {subtitle}
      </Heading>
      </motion.div>
      </VStack>
    </Center>

  </Box>
  );
}


const query = groq`*[_type == "rentalInterestPage"]{
  title,
  pageName,
  subTitle,
  "mainDisplayImage":  mainDisplayImage.asset->url,
  paragraphText1,
  paragraphText2,
  paragraphText3,
  contactSocialLink
}`


export async function getStaticProps(context) {
  // console.log("GET STATIC PROPS");

    const registerInterestPage = await client.fetch(query)

    // console.log("registerInterestPage- DETAILS")
    // console.log(registerInterestPage)


    return {
        props: {
            registerInterestPage
        },
        revalidate: 10, //In seconds

    }
}





export default RentalInterestPage
