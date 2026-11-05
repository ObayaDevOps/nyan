import '@/styles/globals.css'
import Head from 'next/head'
import * as React from 'react'
import { ChakraBaseProvider, ChakraProvider, extendBaseTheme, extendTheme} from '@chakra-ui/react'
import Footer from '../components/footer' 
import SideBar from '../components/sidebar.js' 


//fonts - https://github.com/chakra-ui/chakra-ui/discussions/7235
import {  Unbounded, Permanent_Marker, Inter, Poppins } from 'next/font/google'

const sidebarFont = Unbounded({ subsets: [ 'latin' ], weight: ['400'] })
const textFont = Inter({ subsets: [ 'latin' ], weight: ['400'] })
const registerInterestPageFont = Unbounded({ subsets: [ 'latin' ], weight: ['300'] })




const theme = extendTheme({
  fonts: {
    // sidebarFont: 'sidebarFont.style.fontFamily, sans-serif',
    sidebarFont: sidebarFont.style.fontFamily,
    textFont: textFont.style.fontFamily,
    registerInterestPageFont: registerInterestPageFont.style.fontFamily,


  },
})


export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <Head>
        <link rel="icon" href="/favicon.ico?v=nekosero" sizes="any" />
        <link rel="icon" type="image/png" sizes="256x256" href="/favicon.png?v=nekosero" />
        <link rel="apple-touch-icon" href="/favicon.png?v=nekosero" />
      </Head>
      {/* <SideBar /> */}
      <Component {...pageProps} />
      {/* <Footer /> */}
    </ChakraProvider>

      )
}
