import React from "react";
import NextLink from "next/link";

import {
  Container,
  Stack,
  SimpleGrid,
  Text,
  Heading,
  Link,
  Image,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import ColorModeToggle from "./ColorModeToggle";

export default function FooterComponent() {
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      w="100%"
      color="white"
      bg="#2a4365"
    >
      <Container
        as="footer"
        maxW="container.xl"
        px={{ base: 8, md: 16 }}
        py={{ base: 6, md: 12 }}
        color="brand.muted"
      >
        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={{ base: 12, md: 24, lg: 36 }}
          fontSize="lg"
        >
          {/* LINKS */}
          <Stack direction="row" spacing={3}>
            <Stack direction="column" spacing={3} flex={1} w={36}>
              <Heading
                mb={1}
                size="md"
                color={useColorModeValue("gray.500", "gray.400")}
              >
                Tools
              </Heading>
              <NextLink href="/team" passHref>
                <Link>Links/Emails</Link>
              </NextLink>
              <NextLink href="/team/join" passHref>
                <Link>Survey</Link>
              </NextLink>
              <Link href="https://hackclub.com/slack" isExternal>
                Form/Attendance
              </Link>
            </Stack>
          </Stack>

          {/* Contact */}
          <Stack direction="column" spacing={3} w="auto">
            <Stack direction="column" spacing={1}>
              <Heading
                mb={1}
                size="md"
                color={useColorModeValue("gray.500", "gray.400")}
              >
                Contact
              </Heading>
              <Link isExternal href="https://tinu.tech">
                Personal Website
              </Link>
              <Link isExternal href="mailto:tinu@tinu.tech">
                tinu@tinu.tech
              </Link>
            </Stack>
          </Stack>

          <Stack direction="column" spacing={3} w="auto">
            <Stack direction="column" spacing={1}>
              <ColorModeToggle
                color={useColorModeValue("brand.blue", "brand.black")}
              />
            </Stack>
          </Stack>
        </Stack>

        {/* COPYRIGHT */}
        <Text mt={6}>
          &copy; 2021{" "}
          <Link isExternal href="https://tinu.tech">
            Tinu Vanapamula
          </Link>
        </Text>
      </Container>
    </Flex>
  );
}
