import '@/styles/globals.css'
import * as React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import Footer from '../components/footer' 
import SideBar from '../components/sidebar.js' 


//fonts - https://github.com/chakra-ui/chakra-ui/discussions/7235
import { Noto_Sans, Permanent_Marker, Unbounded } from 'next/font/google'
import { extendTheme } from '@chakra-ui/react'

const sidebarFont = Unbounded({ subsets: [ 'latin' ], weight: ['600'] })
const footerFont = Noto_Sans({ subsets: [ 'latin' ], weight: ['400'] })



const theme = extendTheme({
  fonts: {
    sidebarFont: sidebarFont.style.fontFamily,
    footerFont: footerFont.style.fontFamily,

  },
})


export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      {/* <SideBar /> */}
      <Component {...pageProps} />
      {/* <Footer /> */}
    </ChakraProvider>

      )
}
