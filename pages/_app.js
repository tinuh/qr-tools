import 'tailwindcss/tailwind.css'
import "../styles/globals.css";
import Head from "next/head";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../styles/theme";
import Footer from "../components/footer";
import SideBar from "../components/sidebar";
import { useRouter } from "next/router";
import { Scrollbar } from "react-scrollbars-custom";

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>QR Tools</title>
        <meta property="og:title" content={"QR Tools"} key="ogtitle" />

        <meta property="og:site_name" content={"QR Tools"} key="ogsitename" />
        <meta name="theme-color" content={"#ec3750"} />
      </Head>

      <ChakraProvider theme={theme} resetCSS>
      <Scrollbar style={{ width: "100vw", height: "100vh" }}>
        <div className="flex flex-wrap font-sans mb-20">
          {(router.pathname === "/poll" || router.pathname === "/forms" || router.pathname === "/links") &&
            (<div className="flex-initial md:min-w-1/4 pl-10 pr-10">
              <SideBar />
            </div>)}
          <div className="flex-1">
            <Component {...pageProps} />
          </div>
        </div>
      </Scrollbar>

        <div className="fixed bottom-0 min-w-full">
          <Footer />
        </div>
      </ChakraProvider>
    </>
  );
}

export default MyApp;
