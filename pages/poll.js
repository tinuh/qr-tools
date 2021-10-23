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
  Tooltip,
  Heading,
  Select
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";

export default function Survey() {

  const [link, setLink] = React.useState("");
  const [published, setPub] = React.useState(false);
  const [choices, setChoices] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [responses, setResponses] = React.useState({});
  const [metaData, setMetaData] = React.useState({});

  const { register, handleSubmit, watch, formState: { errors }} = useForm();
  const watchAll = watch();

  const onSubmit = (data) => {
    data.choices = choices;
    setMetaData(data);
    publish(data);
  }

  //import peerjs
  React.useEffect(() => {
    const fn = async () => {
      const PeerJs = (await import("peerjs")).default;

    };
    fn();
  }, []);

  const publish = (metaData) => {
    setPub(true);
    const peer = new Peer();

    peer.on("open", function (id) {
      setLink(process.env.NEXT_PUBLIC_URI + "/p/" + id);
      console.log("My peer ID is: " + id);
      setLoading(false);
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

  const addChoice = () => {
    let temp = [...choices, ''];
    setChoices(temp);
    console.log(choices);
  }

  const deleteChoice = (key) => {
    let temp = [...choices];
    temp.splice(key, 1);
    setChoices(temp);
  }

  const updateChoice = (event, key) => {
    let temp = [...choices];
    temp[key] = event.target.value;
    setChoices(temp);
  }

  return (
    <Flex>
      <Box minW="lg" w="50%" m={10}>
        {(!published || loading) &&
          (<form onSubmit={handleSubmit(onSubmit)}>
            <FormControl id="link" isInvalid={errors.question}>
              <FormLabel>Poll Question</FormLabel>

              <Input id="question" placeholder="Question" disabled={published} type="link"
                {...register("question", {
                  required: "This is required",
                  minLength: { value: 4, message: "Minimum length should be 4" }
                })} 
              />
              
              <FormErrorMessage>
                {errors.question && errors.question.message}
              </FormErrorMessage>
            </FormControl>

            <div className="flex mt-5">
                <div className="pr-3 flex-auto">
                  <Select
                    {...register("type")} 
                  >
                    <option value="multiple" default>Multiple Choice</option>
                    <option value="single">Single Choice</option>
                    <option value="free">Free Response</option>
                  </Select>
                </div>
                <Tooltip label="Add Answer Choice">
                  <Button onClick={addChoice} disabled={published || watchAll.type === "free"}>+</Button>
                </Tooltip>
              </div>

            <br />
            {watchAll.type !== "free" && choices.map((val, key) =>
              <FormControl key={key}>
                <FormLabel>Choice {key + 1}</FormLabel>

                <div className="flex">
                  <div className="pr-3 flex-auto">
                    <Input disabled={published} value={val} onChange={(event) => updateChoice(event, key)} placeholder={`Choice ${key + 1}`} />
                  </div>
                  <Tooltip label="Delete Answer Choice">
                    <Button disabled={published} onClick={() => deleteChoice(key)} colorScheme="red">X</Button>
                  </Tooltip>
                </div>

                <br />
              </FormControl>
            )}

            <Button disabled={published} type="submit" colorScheme="teal">
              Create Poll
            </Button>
          </form>)}
        {(published && !loading) &&
          <div>
            <Heading size="lg" align="center">{metaData.question}</Heading>
          </div>}
      </Box>
      <Box m="10">
        {(published && loading) && <Heading size="lg" align="center" >Creating Poll...</Heading>}
        {(published && !loading) &&
          <div>
            <QRCode value={link} />
            <p>{link}</p>
          </div>}
      </Box>
    </Flex>
  );
}
