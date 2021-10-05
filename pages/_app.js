import "../styles/globals.css";
import Head from "next/head";
import { ChakraProvider, Flex, Box } from "@chakra-ui/react";
import theme from "../styles/theme";
import Footer from "../components/footer";
import SideBar from "../components/sidebar";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>QR Tools</title>
        <meta property="og:title" content={"QR Tools"} key="ogtitle" />
        <link rel="icon" href="/favicon.png" />

        <meta property="og:site_name" content={"QR Tools"} key="ogsitename" />
        <meta name="theme-color" content={"#ec3750"} />
      </Head>

      <ChakraProvider theme={theme} resetCSS>
        <Flex>
          <Box w = "25%">
            <SideBar/>
          </Box>
          <Box>
            <Component {...pageProps}/>
          </Box>
        </Flex>
        <Footer/>
      </ChakraProvider>
    </>
  );
}

export default MyApp;
