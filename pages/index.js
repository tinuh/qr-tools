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

export default function Home() {
  const [link, setLink] = React.useState("");

  const handleLink = (event) => {
    setLink(event.target.value);
  }

  return (
    <div className = "flex">
      <Box minW="lg" w="50%" m = {10}>
        QR Tools
      </Box>
      <Box m="10">
        <QRCode value={link} />
      </Box>
    </div>
  );
}
