import React from "react";
import Head from "next/head";
import { QRCode } from "react-qrcode-logo";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
} from "@chakra-ui/react";

export default function Survey() {
  const [link, setLink] = React.useState("https://qr.tinu.tech/s/");

  const handleLink = (event) => {
    setLink(event.target.value);
  }

  return (
    <Flex>
      <Box minW="lg" w="50%" m = {10}>
        <FormControl id="link">
          <FormLabel>Survey Question</FormLabel>
          <Input type="link"/>
          <FormHelperText>We won&apos;t store it anywhere</FormHelperText>
        </FormControl>
      </Box>
      <Box m="10">
        <QRCode value={link} />
      </Box>
    </Flex>
  );
}
