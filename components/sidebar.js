import React from "react";
import { Box, Button, Stack, Heading } from "@chakra-ui/react";

export default function sidebar() {
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
        <Button>Links/Emails</Button>
        <Button>Survey</Button>
        <Button>Form/Attendance</Button>
      </Stack>
    </Box>
  );
}