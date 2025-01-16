import React, {useState} from 'react';
import { Box, IconButton, AspectRatio } from '@chakra-ui/react';
import { VolumeUp, Volume2, VolumeOff, ChevronDown } from "lucide-react";


const BoxWithYoutubeBackground = ({ videoId, children }) => {
    // console.log('isMuted',isMuted );
    // console.log(`${isMuted? 0: 1}`)

    const [isMuted, setIsMuted] = useState(true);


    const toggleMute = () => {
        setIsMuted(!isMuted);
    };
    

  return (
    <Box position="relative" minH={"100vh"} w="full" 
    overflow="hidden"
    >
      {/* YouTube iframe container */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        pointerEvents="none"
        overflow="hidden"
      >
        <Box position="relative" w="full" h="full" paddingTop="56.25%" overflow={'hidden'}>
          <Box
            as="iframe"
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            // w="100%"
            // h='calc((100vw*9) /16)'
            w='full'
            h='full'

            // overflow='hidden'
            transform={{base:"scale(4.5)", md: "scale(4.5)", lg: "scale(1.25)" }}
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${isMuted? 1: 0}&controls=0&loop=1&playlist=${videoId}&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </Box>
      </Box>
      
      {/* Semi-transparent overlay */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bg="blackAlpha.600"
      />

        <IconButton
        aria-label={isMuted ? "Unmute video" : "Mute video"}
        icon={isMuted ? <Volume2 size={48} p={8} /> : <VolumeOff size={48} p={8}/>}
        position="absolute"
        bottom="32"
        right="4"
        zIndex={2}
        colorScheme="white"
        onClick={toggleMute}
        _hover={{ bg: 'blackAlpha.700' }}
      />
      
      {/* Content container */}
      <Box position="relative" zIndex={1}>
        {children}
      </Box>
    </Box>
  );
};

export default BoxWithYoutubeBackground;