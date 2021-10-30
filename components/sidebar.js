import React from "react";
import { Box, Button, Stack, Heading } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from 'next/router'

export default function Sidebar() {
  const router = useRouter();

  return (
    <Box
      className = "min-w-full"
      maxW="xs"
      borderWidth="3px"
      borderRadius="lg"
      overflow="hidden"
      m={10}
      p={5}
    >
      <Stack>
        <Heading size="lg" align="center" pb={3}>
          QR Tools
        </Heading>
        <NextLink href = "/links" passHref>
          <Button variant = {router.pathname === "/links" ? "solid" : "outline"} colorScheme= "blue">Links/Emails</Button>
        </NextLink>
        <NextLink href = "/poll" passHref>
          <Button variant = {router.pathname === "/poll" ? "solid" : "outline"} colorScheme= "blue">Realtime Polls</Button>
        </NextLink>
        <NextLink href = "/form" passHref>
          <Button variant = {router.pathname === "/form" ? "solid" : "outline"} colorScheme= "blue">Form/Attendance</Button>
        </NextLink>
      </Stack>
    </Box>
  );
}