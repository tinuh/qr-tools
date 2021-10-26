import React from "react";
import Head from "next/head";
import { QRCode } from "react-qrcode-logo";
import {
  Box,
  Heading,
  Container,
  SimpleGrid,
  Image,
  Text,
  Center
} from "@chakra-ui/react";
import Link from "next/link";
import Button from '../components/button';
import { motion } from 'framer-motion';

export default function Home() {
  const [link, setLink] = React.useState("");

  const handleLink = (event) => {
    setLink(event.target.value);
  }

  return (
    <div>
      <Box py={10} px={10} textAlign="center">
          <motion.div
            initial={{ y: -200 }}
            animate={{ y: 0 }}
            transition = {{ duration: 1 }}            
          >
            <Heading as="h1" size="2xl" m={2}>QR Tools</Heading>
            <Heading as="h2" size="lg" fontWeight="normal">
                Realtime QR Tools utilizing p2p connections
            </Heading>
          </motion.div>
          <Link href="/poll" passHref>
              <Button
                my = {8}
                size = "lg"
                bgGradient="linear(to-tl,red.500,teal.500)"
                _hover={{
                  bgGradient: "linear(to-tl,red.500,teal.500)",
                }}
                _active={{
                  bgGradient: "linear(to-tl,red.500,teal.500)",
                }}
              >Get started today</Button>
          </Link>
      </Box>

      <Container maxW="container.lg" p={12}>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={12}>
          <motion.div
            initial={{ x: -200 }}
            animate={{ x: 0 }}
            transition = {{ duration: 1 }}            
          >
            <Box>
                <Center>
                  <Image m={4} src='https://pollster.ink/images/create.svg' alt="create" h={48}/>
                </Center>
                <Heading as="h3" size="lg" my={2}>For everyone, and anyone.</Heading>
                <Text fontSize="lg">
                    Teachers, presenters, and even the ordinary person can launch realtime polls & forms about whatever they want. Whether you just want to get a rooms attendance, get people&apos;s opinion, or just create polls/forms for fun, QR Tools if for you.
                </Text>
            </Box>
          </motion.div>
          <motion.div
            initial={{ x: 200 }}
            animate={{ x: 0 }}
            transition = {{ duration: 1 }}            
          >
            <Box>
                <Center>
                    <Image m={4} src='https://pollster.ink/images/pwa.svg' alt="create" h={48}/>
                </Center>
                <Heading as="h3" size="lg" my={2}>Use QR Tools on any device!</Heading>
                <Text fontSize="lg">
                    QR Tools is PWA optimized, so you can use it on a regular browser or downloded as a native app on any device!
                </Text>
            </Box>
          </motion.div>
          </SimpleGrid>
      </Container>

      {/* <Container maxW="container.lg" p={12}>
          <Heading as="h2" size="xl" my={2}
              color="brand.500"
          >Get the app</Heading>
          <Text fontSize="lg">
          Download (or use the web version) Pollster today and create and answer polls to help your community.
          </Text>
          <Button colorScheme="blue" variant="solid" my={4} leftIcon={<DownloadIcon />}>Download for mobile/desktop</Button>
      </Container> */}

    </div>
  );
}
