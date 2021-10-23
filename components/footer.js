import React from "react";
import NextLink from "next/link";

import {
  Container,
  Stack,
  Text,
  Heading,
  Link,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import ColorModeToggle from "./ColorModeToggle";

export default function FooterComponent() {
  return (
    <Flex
      p = {4}
      as="footer"
      align="center"
      justify="space-between"
      wrap="wrap"
      w="100%"
      color="white"
      bg="#2a4365"
    >
      <Flex align="center" direction={{ base: "column", md: "row" }}>
        <Text m={2} color="gray.400">&copy; 2021 &nbsp;
          <Link isExternal href="https://tinu.tech">
              Tinu Vanapamula
          </Link>
        </Text>

      </Flex>
      <Stack m={2} spacing={4} direction="row" justify="center" align="center">
        <ColorModeToggle color={useColorModeValue("brand.700", "white")}/>
      </Stack>
    </Flex>
  );
}
