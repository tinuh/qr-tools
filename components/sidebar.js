import React from "react";
import { Box, Button, Stack, Heading } from "@chakra-ui/react";
import NextLink from "next/link";

export default function Sidebar() {
  return (
    <Box
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
          <Button>Links/Emails</Button>
        </NextLink>
        <NextLink href = "/survey" passHref>
          <Button>Survey</Button>
        </NextLink>
        <NextLink href = "/forms" passHref>
          <Button>Form/Attendance</Button>
        </NextLink>
      </Stack>
    </Box>
  );
}