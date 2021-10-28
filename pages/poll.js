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
  Select,
  ButtonGroup,
  Slider,
  SliderFilledTrack,
  SliderTrack,
  SliderThumb
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Bar, Pie } from "react-chartjs-2";

export default function Survey() {
  const [link, setLink] = React.useState("");
  const [published, setPub] = React.useState(false);
  const [choices, setChoices] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [resData, setResData] = React.useState({});
  const [freeData, setFreeData] = React.useState([]);
  const [metaData, setMetaData] = React.useState({});
  const [chartType, setChart] = React.useState('pie');
  const [qrSize, setQrSize] = React.useState(150);

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
    await fetch("https://qr-tools-save.tinu-personal.workers.dev", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers : {
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
        "Access-Control-Max-Age": "86400",
      },
      referrerPolicy: "no-referrer",
      body: JSON.stringify(data)
    }).then(res => {
      console.log(res);
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
                <FormControl key={key}>
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
                <Button onClick = {() => save({...resData})} colorScheme="teal">
                  Save Data
                </Button>
              </div>}
            {metaData.type === "free" && 
              <div>
                <div className = "flex flex-wrap mt-5">
                {freeData.map((res, key) => 
                  <Box className = "p-3 m-3 flex-auto text-center" key = {key} borderWidth = "2px" borderRadius="lg">
                    {res}
                  </Box>)}
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

            <Slider aria-label="slider-ex-1" defaultValue={150} min={100} max={300} onChange={(val) => setQrSize(val)}>
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