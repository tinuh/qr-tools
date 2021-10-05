import React from "react";
import { Box, Button, Stack } from "@chakra-ui/react";

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
        <Button>Links/Emails</Button>
        <Button>Survey</Button>
        <Button>Form/Attendance</Button>
      </Stack>
    </Box>
  );
}
