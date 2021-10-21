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
  FormErrorMessage,
  Tooltip
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";

export default function Survey() {
  const [link, setLink] = React.useState("");
  const [published, setPub] = React.useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    publish(data);
  }

  React.useEffect(() => {
    const fn = async () => {
      const PeerJs = (await import("peerjs")).default;
      // set it to state here
    };
    fn();
  }, []);

  const publish = (metaData) => {
    setPub(true);
    const peer = new Peer();

    peer.on("open", function (id) {
      setLink(process.env.NEXT_PUBLIC_URI + "/p/" + id);
      console.log("My peer ID is: " + id);
    });

    peer.on("connection", async (conn) => {
      console.log("Connected to peer: ", conn.peer)

      conn.on("open", () => {
        console.log(metaData);
        conn.send(metaData);
      })

      conn.on("data", (data) => {
        console.log("Received", data);
      });

    });
  };

  return (
    <Flex>
      <Box minW="lg" w="50%" m={10}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl id="link" isInvalid={errors.name}>
            <FormLabel>Poll Question</FormLabel>
            <div className="flex">
              <div className="pr-3 flex-auto">
                <Input id = "question" placeholder = "Question" {...register("question", {
                  required: "This is required",
                  minLength: { value: 4, message: "Minimum length should be 4" }
                })} disabled={published} type="link" />
              </div>
              <Tooltip label="Add Answer Choice">
                <Button>+</Button>
              </Tooltip>
            </div>
            <FormErrorMessage>
              {errors.name && errors.name.message}
            </FormErrorMessage>
            <Button disabled={published} type="submit" colorScheme="teal">
              Create Poll
            </Button>
          </FormControl>
        </form>
      </Box>
      <Box m="10">
        {link && <QRCode value={link} />}
        {link && link}
      </Box>
    </Flex>
  );
}
