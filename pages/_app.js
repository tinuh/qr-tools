import 'tailwindcss/tailwind.css'
import "../styles/globals.css";
import Head from "next/head";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../styles/theme";
import Footer from "../components/footer";
import SideBar from "../components/sidebar";
import { useRouter } from "next/router";
import { Scrollbar } from "react-scrollbars-custom";
import { motion } from "framer-motion";

function MyApp({ Component, pageProps, router }) {
  const navRoutes = [
    '/poll',
    '/forms',
    '/links'
  ]

  return (
    <>
      <Head>
        <title>QR Tools</title>
        <meta property="og:title" content={"QR Tools"} key="ogtitle" />
        <link rel="icon" href="/icon.png" />

        <meta property="og:site_name" content={"QR Tools"} key="ogsitename" />
        <meta name="theme-color" content={"#ec3750"} />
      </Head>

      <ChakraProvider theme={theme} resetCSS>
      <Scrollbar style={{ width: "100vw", height: "100vh" }}>
          {navRoutes.includes(router.pathname) ?
          <div className="flex flex-wrap font-sans mb-20">
            <div className="flex-initial md:min-w-1/4 pl-10 pr-10">
              <SideBar />
              
            </div>
            <motion.div 
                key = {router.route}
                className="flex-1"
                initial={{ y: -200 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 50 }}
              >  
                <Component {...pageProps} />
              </motion.div>
            </div> :
              <Component {...pageProps} />
            }
                
      </Scrollbar>

        <div className="fixed bottom-0 min-w-full">
          <Footer />
        </div>
      </ChakraProvider>
    </>
  );
}

export default MyApp;
