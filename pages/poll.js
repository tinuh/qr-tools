import React from "react";
import Head from "next/head";
import { QRCode } from "react-qrcode-logo";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  FormHelperText,
	Tooltip
} from "@chakra-ui/react";

export default function Survey() {
  const [link, setLink] = React.useState("");
	const [published, setPub] = React.useState(false);
	const [pollMeta, setMeta] = React.useState({});

  const handleLink = (event) => {
    setLink(event.target.value);
  };

  React.useEffect(() => {
    const fn = async () => {
      const PeerJs = (await import("peerjs")).default;
      // set it to state here
    };
    fn();
  }, []);

  const publish = () => {
		setPub(true);
    const peer = new Peer();

    peer.on("open", function (id) {
      setLink(process.env.NEXT_PUBLIC_URI + "/p/" + id);
      console.log("My peer ID is: " + id);
    });

    peer.on("connection", async (conn) => {
			await console.log("Connected to peer: ", conn.peer)
			await conn.send("This is the example question.");

      conn.on("data", (data) => {
        console.log("Received", data);
      });
		
    });
  };

  return (
    <Flex>
      <Box minW="lg" w="50%" m={10}>
        <FormControl id="link">
          <FormLabel>Poll Question</FormLabel>
					<div className = "flex">
						<div className = "pr-3 flex-auto">
							<Input disabled = {published} type="link"/> 
						</div>
						<Tooltip label = "Add Answer Choice">
							<Button>+</Button>
						</Tooltip>
					</div>
          <FormHelperText>We won&apos;t store it anywhere</FormHelperText>
          <Button disabled = {published} onClick={publish} colorScheme="teal">
            {" "}
            Create Poll
          </Button>
        </FormControl>
      </Box>
      <Box m="10">
        <QRCode value={link} />
        {link}
      </Box>
    </Flex>
  );
}
