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
	Slider, 
	SliderThumb,
	SliderFilledTrack,
	SliderTrack,
  Image
} from "@chakra-ui/react";
import { motion } from "framer-motion";

export default function Home() {
  const [link, setLink] = React.useState("");
	const [qrSize, setQrSize] = React.useState(150);

  const handleLink = (event) => {
    setLink(event.target.value);
  }

  return (
    <div className = "flex">
      <Box minW="lg" w="50%" m = {10}>
        <FormControl id="link">
          <FormLabel>Link</FormLabel>
          <Input value = {link} type="link" onChange={handleLink}/>
          <FormHelperText>We won&apos;t store it anywhere</FormHelperText>
        </FormControl>
      </Box>
      <Box className = "align-center m-10">
				{link !== "" && 
					<div>
            <motion.div
              initial={{ x: 200 }}
              animate={{ x: 0 }}
              transition = {{ duration: 1, type: "spring", stiffness: 50 }}
            >
						  <QRCode value={link} size = {qrSize} logoImage = "/img/qr-tools.png"/>
            </motion.div>
            <br />
						<Slider aria-label="slider-ex-1" defaultValue={150} min={100} max={300} onChange={(val) => setQrSize(val)}>
							<SliderTrack>
								<SliderFilledTrack />
							</SliderTrack>
							<SliderThumb />
						</Slider><br />

						<p>{link}</p>
					</div>}
      </Box>
    </div>
  );
}
