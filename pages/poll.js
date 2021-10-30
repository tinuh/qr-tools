import React, {useState} from "react";
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
  Select,
  ButtonGroup,
  Slider,
  SliderFilledTrack,
  SliderTrack,
  SliderThumb,
  useToast
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Bar, Pie } from "react-chartjs-2";
import { CSVLink } from "react-csv";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShareAlt } from '@fortawesome/free-solid-svg-icons';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { ThreeDots } from 'react-loading-icons';

export default function Poll() {
  const toast = useToast();

  const [link, setLink] = useState("");
  const [published, setPub] = useState(false);
  const [choices, setChoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resData, setResData] = useState({});
  const [freeData, setFreeData] = useState([]);
  const [metaData, setMetaData] = useState({});
  const [chartType, setChart] = useState('pie');
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
    data.choices = choices;
    setMetaData(data);

    let temp = {};
    choices.map((choice) => {
      temp[choice] = 0;
    });
    console.log(temp);
    setResData({ ...temp });

    console.log(resData);

    publish(data);
  };

  //method to save data to cloudflare KV using workers
  const save = async(data) => {
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
      body: JSON.stringify({question: metaData.question, type: metaData.type, data: metaData.type === "free" ? freeData : data})
    }).then(res => res.json()).then(data => {
      console.log(data);
      let link = `${process.env.NEXT_PUBLIC_URI}/poll/v/${data.key}`;

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
      }
    });
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
    if (data.type === "multiple" || data.type === "single") {
      console.log(resData);
      Object.keys(data.data).map(function (key) {
        if (data.data[key]) {
          setResData((prevState) => {
            return {...prevState, [key]: prevState[key] + 1 };
          });
        }
      });
    }
    else if (data.type === "free"){
      setFreeData((prevData) => {
        return [...prevData, data.data];
      });
    }
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

  const graphData = {
    labels: Object.keys(resData),
    datasets: [
      {
        label: "# of votes",
        data: Object.values(resData),
        borderWidth: 1,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
      },
    ],
  };

  const csvData = metaData.type === "free" ?
  [

  ] :
  [
    [metaData.question],
    [],
    [...choices],
    choices.map((choice) => resData[choice])
  ]

  return (
    <div className = "flex">
      <Box minW="lg" w="50%" m={10}>
        {(!published || loading) && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl id="link" isInvalid={errors.question}>
              <FormLabel>Poll Question</FormLabel>

              <Input
                id="question"
                placeholder="Question"
                disabled={published}
                type="link"
                {...register("question", {
                  required: "This is required",
                  minLength: {
                    value: 4,
                    message: "Minimum length should be 4",
                  },
                })}
              />

              <FormErrorMessage>
                {errors.question && errors.question.message}
              </FormErrorMessage>
            </FormControl>

            <div className="flex mt-5">
              <div className="pr-3 flex-auto">
                <Select {...register("type")} defaultValue="single" disabled = {published}>
                  <option value="single">Single Choice</option>
                  <option value="multiple">Multiple Choice</option>
                  <option value="free">Free Response</option>
                </Select>
              </div>
              <Tooltip label="Add Answer Choice">
                <Button
                  onClick={addChoice}
                  disabled={published || watchAll.type === "free"}
                >
                  +
                </Button>
              </Tooltip>
            </div>

            <br />
            {watchAll.type !== "free" &&
              choices.map((val, key) => (
                <motion.div 
                  key = {key}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition = {{ duration: 0.4 }}
                >
                  <FormControl>
                    <FormLabel>Choice {key + 1}</FormLabel>
                    <div className="flex">
                      <div className="pr-3 flex-auto">
                        <Input
                          disabled={published}
                          value={val}
                          onChange={(event) => updateChoice(event, key)}
                          placeholder={`Choice ${key + 1}`}
                        />
                      </div>
                      <Tooltip label="Delete Answer Choice">
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
              Create Poll
            </Button>
          </form>
        )}
        {published && !loading && (
          <div className = "grid justify-items-center">
            <Heading size="lg" align="center">
              {metaData.question}
            </Heading>
            {(metaData.type === "single" || metaData.type === "multiple") && 
              <div className="mt-10 w-2/3 text-center">
                <ButtonGroup isAttached mb={5}>
                  <Button mr="-px" onClick = {() => setChart('pie')}>Pie</Button>
                  <Button onClick = {() => setChart('bar')}>Bar</Button>
                </ButtonGroup>
                {chartType === 'pie' && <Pie data={graphData} />}
                {chartType === 'bar' && <Bar data={graphData} />}
              </div>}
            {metaData.type === "free" && 
              <div>
                <div className = "flex flex-wrap mt-5">
                {freeData.map((res, key) => 
                <motion.div 
                  className = "m-3 flex-auto text-center" 
                  key = {key}
                  initial={{ y: 200 }}
                  animate={{ y: 0 }}
                  transition = {{ duration: 1, type: "spring", stiffness: 50 }}
                >
                  <Box p = {3} borderWidth = "2px" borderRadius="lg">
                    {res}
                  </Box>
                </motion.div>)}
                </div>
              </div>}
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

            <Button leftIcon={sharing ? <></> :<FontAwesomeIcon icon={faShareAlt}/>} onClick = {() => save({...resData})} colorScheme="teal" mt={5} mr={5}>
              {sharing ? <ThreeDots width = {50} /> : <>Share Results</>}
            </Button>

            <CSVLink 
              data = {csvData}
              filename = {`QR Tools - ${metaData.question}.csv`}
            >
              <Button leftIcon={<FontAwesomeIcon icon={faDownload}/>} colorScheme="teal" mt={5}>
                Download Results
              </Button>
            </CSVLink>
          </Box>
        )}
      </Box>
    </div>
  );
}