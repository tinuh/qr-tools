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

export default function Home() {
  const [link, setLink] = React.useState("");

  const handleLink = (event) => {
    setLink(event.target.value);
  }

  return (
    <div>
      <Box py={10} px={10}
          textAlign="center"
      >
          <Heading as="h1" size="2xl" m={2}>QR Tools</Heading>
          <Heading as="h2" size="lg" fontWeight="normal">
              Realtime QR Tools with p2p connections
          </Heading>
          <Link href="/poll">
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
          <Box>
              <Center>
                <Image m={4} src='https://pollster.ink/images/create.svg' alt="create" h={48}/>
              </Center>
              <Heading as="h3" size="lg" my={2}>For everyone, and anyone.</Heading>
              <Text fontSize="lg">
                  Teachers, members of the government, and even concerned citizens can launch polls about problems they are facing to get opinions on the best method to approach the problem. Or, anyone can create polls just for fun!
              </Text>
          </Box>
          <Box>
              <Center>
                  <Image m={4} src='https://pollster.ink/images/options.svg' alt="create" h={48}/>
              </Center>
              <Heading as="h3" size="lg" my={2}>Customized and relevant.</Heading>
              <Text fontSize="lg">
                  The community can pick and choose which polls are most important for them, this can allow the community to prioritize the most urgent polls that could potentially cause drastic reforms.
              </Text>
          </Box>
          <Box>
              <Center>
                  <Image m={4} src='https://pollster.ink/images/map.svg' alt="create" h={48}/>
              </Center>
              <Heading as="h3" size="lg" my={2}>Built with community values in mind.</Heading>
              <Text fontSize="lg">
              Easily find polls near you, with an interactive map. You can answer polls related to problems that are arising in your community that can help better the environment, aid in the growth of local startups, allow you to share your ideas with your local government, and so much more!
              </Text>
          </Box>
          <Box>
              <Center>
                  <Image m={4} src='https://pollster.ink/images/pwa.svg' alt="create" h={48}/>
              </Center>
              <Heading as="h3" size="lg" my={2}>Use Pollster anywhere!</Heading>
              <Text fontSize="lg">
                  Pollster is PWA optimized, so you can download it and run it as if it were a native app!
              </Text>
          </Box>
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
