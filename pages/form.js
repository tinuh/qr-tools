import React, { useState } from "react";
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
  Tr,
  Th,
  Td,
  useToast
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { CSVLink } from "react-csv";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareAlt, faSave, faDownload } from '@fortawesome/free-solid-svg-icons';
import { ThreeDots } from 'react-loading-icons';
import { useRouter } from "next/router";

export default function Form() {
  const toast = useToast();
  const router = useRouter();

  const [link, setLink] = useState("");
  const [published, setPub] = useState(false);
  const [choices, setChoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resData, setResData] = useState([]);
  const [metaData, setMetaData] = useState({});
  const [qrSize, setQrSize] = useState(200);
  const [sharing, setSharing] = useState(false);

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

    window.addEventListener("beforeunload", (ev) => 
    {  
        ev.preventDefault();
        return ev.returnValue = 'Are you sure you want to close?';
    }); 
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

  const share = async(data) => {
    setSharing(true);
    await fetch("https://qr-tools-save.tinu-personal.workers.dev", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers   : {
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
        "Access-Control-Max-Age": "86400",
      },
      referrerPolicy: "no-referrer",
      body: JSON.stringify({name: metaData.name, data: data})
    }).then(res => res.json()).then(data => {
      console.log(data);
      let link = `${process.env.NEXT_PUBLIC_URI}/f/v/${data.key}`;

      try {
        navigator.clipboard.writeText(link);

        toast({
            title: "Copied to Clipboard",
            description: "The sharing link is copied to clipboard",
            status: "success",
            isClosable: true,
        })
        setSharing(false);
      }
      catch{
          toast({
              title: "Error",
              description: "Error copying to clipboard",
              status: "error",
              isClosable: true,
          })

          alert(`Your sharing link is ${link}`);
      }
    });
  }

  const csvHeaders = choices.map((field) => {
    return {label: field, key: field}
  });

  const exit = () => {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;

    let raw = {name: metaData.name, date: today, data: resData};
    let curr = localStorage.getItem('history');

    if (curr !== null){
      let arr = JSON.parse(curr);
      arr.push(raw);
      localStorage.setItem('history', JSON.stringify(arr));
    }
    else {
      localStorage.setItem('history', JSON.stringify([raw]));
    }

    toast({
      title: "Form Saved",
      description: "Your form was succesfully saved!",
      status: "success",
      isClosable: true,
    })

    router.push('/history')
  }

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
                    id="name"
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
                    <motion.tr 
                      key = {key}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition = {{ duration: 0.4 }}
                    >
                      {metaData.fields.map((field, fKey) => 
                        <Td key = {fKey}>{res[field]}</Td>
                      )}
                    </motion.tr>
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
            Creating Form...
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

            <Button disabled = {sharing} leftIcon={sharing ? <></> :<FontAwesomeIcon icon={faShareAlt}/>} onClick = {() => share({...resData})} colorScheme="teal" mt={5} mr={5}>
              {sharing ? <ThreeDots width = {50} /> : <>Share</>}
            </Button>

            <CSVLink 
              data = {resData}
              headers = {csvHeaders}
              filename = {`QR Tools - ${metaData.name}.csv`}
            >
              <Button leftIcon={<FontAwesomeIcon icon={faDownload}/>} colorScheme="teal" mt={5} mr = {5}>
                Download
              </Button>
            </CSVLink>

            <Button onClick = {exit} leftIcon={<FontAwesomeIcon icon={faSave}/>} colorScheme="green" mt={5}>
              Save & Exit
            </Button>
          </Box>
        )}
      </Box>
    </div>
  );
}