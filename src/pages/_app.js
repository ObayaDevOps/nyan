import '@/styles/globals.css'
import * as React from 'react'
import { ChakraBaseProvider, extendBaseTheme} from '@chakra-ui/react'
import Footer from '../components/footer' 
import SideBar from '../components/sidebar.js' 


//fonts - https://github.com/chakra-ui/chakra-ui/discussions/7235
import {  Unbounded, Permanent_Marker } from 'next/font/google'

const sidebarFont = Unbounded({ subsets: [ 'latin' ], weight: ['400'] })



const theme = extendBaseTheme({
  fonts: {
    // sidebarFont: 'sidebarFont.style.fontFamily, sans-serif',
    sidebarFont: sidebarFont.style.fontFamily

  },
})


export default function App({ Component, pageProps }) {
  return (
    <ChakraBaseProvider theme={theme}>
      {/* <SideBar /> */}
      <Component {...pageProps} />
      {/* <Footer /> */}
    </ChakraBaseProvider>

      )
}
