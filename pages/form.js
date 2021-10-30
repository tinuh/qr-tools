import React from "react";
import { QRCode } from "react-qrcode-logo";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  FormErrorMessage,
  Tooltip,
  Heading,
  Slider,
  SliderFilledTrack,
  SliderTrack,
  SliderThumb,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { CSVLink } from "react-csv";

export default function () {
  const [link, setLink] = React.useState("");
  const [published, setPub] = React.useState(false);
  const [choices, setChoices] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [resData, setResData] = React.useState([]);
  const [metaData, setMetaData] = React.useState({});
  const [qrSize, setQrSize] = React.useState(200);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const watchAll = watch();

  const onSubmit = (data) => {
    data.fields = [...choices];
    setMetaData(data);

    publish(data);
  };

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
      setLink(process.env.NEXT_PUBLIC_URI + "/f/" + id);
      console.log("My peer ID is: " + id);
      setLoading(false);
    });

    peer.on("connection", async (conn) => {
      console.log("Connected to peer: ", conn.peer);

      conn.on("open", () => {
        console.log(metaData);
        conn.send(metaData);
      });

      conn.on("data", (data) => {
        console.log("Received", data);
        onData(data);
      });
    });
  };

  const onData = (data) => {
    setResData((prevState) => {
      return [...prevState, data];
    })
  };

  const addChoice = () => {
    let temp = [...choices, ""];
    setChoices(temp);
  };

  const deleteChoice = (key) => {
    let temp = [...choices];
    temp.splice(key, 1);
    setChoices(temp);
  };

  const updateChoice = (event, key) => {
    let temp = [...choices];
    temp[key] = event.target.value;
    setChoices(temp);
  };

  return (
    <div className = "flex">
      <Box minW="lg" w="50%" m={10}>
        {(!published || loading) && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl id="link" isInvalid={errors.name}>
              <div className="flex mt-5">
                <div className="pr-3 flex-auto">
                  <FormLabel>Form Name</FormLabel>

                  <Input
                    id="question"
                    placeholder="Name"
                    disabled={published}
                    type="link"
                    {...register("name", {
                      required: "This is required",
                      minLength: {
                        value: 4,
                        message: "Minimum length should be 4",
                      },
                    })}
                  />
                  

                  <FormErrorMessage>
                    {errors.name && errors.name.message}
                  </FormErrorMessage>
                </div>

                <div className = "mt-8">
                  <Tooltip label="Add Field">
                    <Button
                      onClick={addChoice}
                      disabled={published || watchAll.type === "free"}
                    >
                      +
                    </Button>
                  </Tooltip>
                </div>
              </div>
            </FormControl>

            <br />
            {watchAll.type !== "free" &&
              choices.map((val, key) => (
                <motion.div 
                  key = {key}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition = {{ duration: 0.4 }}
                >
                  <FormControl key={key}>
                    <FormLabel>Field {key + 1}</FormLabel>

                    <div className="flex">
                      <div className="pr-3 flex-auto">
                        <Input
                          disabled={published}
                          value={val}
                          onChange={(event) => updateChoice(event, key)}
                          placeholder={`Field ${key + 1}`}
                        />
                      </div>
                      <Tooltip label="Delete Field">
                        <Button
                          disabled={published}
                          onClick={() => deleteChoice(key)}
                          colorScheme="red"
                        >
                          X
                        </Button>
                      </Tooltip>
                    </div>

                    <br />
                  </FormControl>
                </motion.div>
              ))}

            <Button disabled={published} type="submit" colorScheme="teal">
              Create Form
            </Button>
          </form>
        )}
        {published && !loading && (
          <div className = "grid justify-items-center">
            <Heading size="lg" align="center">
              {metaData.name}
            </Heading>
            <Box borderWidth = "3px" borderRadius="lg" className = "mt-5 w-full">
              <Table variant="simple">
                <Thead>
                  <Tr>
                    {metaData.fields.map((field, key) => 
                      <Th key = {key}>{field}</Th>
                    )}
                  </Tr>
                </Thead>
                <Tbody>
                  {resData.map((res, key) => 
                    <Tr key = {key}>
                      {metaData.fields.map((field, fKey) => 
                        <Td key = {fKey}>{res[field]}</Td>
                      )}
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </Box>
          </div>
        )}
      </Box>
      <Box m="10">
        {published && loading && (
          <Heading size="lg" align="center">
            Creating Poll...
          </Heading>
        )}
        {published && !loading && (
          <Box align = "center">
            <motion.div
              initial={{ x: 200 }}
              animate={{ x: 0 }}
              transition = {{ duration: 1, type: "spring", stiffness: 50 }}
            >
              <QRCode value={link} size = {qrSize} /><br />
            </motion.div>

            <Slider aria-label="slider-ex-1" defaultValue={qrSize} min={100} max={300} onChange={(val) => setQrSize(val)}>
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider><br />

            <p>{link}</p>
          </Box>
        )}
      </Box>
    </div>
  );
}