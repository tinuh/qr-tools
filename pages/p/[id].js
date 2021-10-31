import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { 
	Button, 
	Heading, 
	Box, 
	Checkbox, 
	RadioGroup, 
	Radio, 
	FormControl,
	Input,
	Text, 
	FormHelperText,
	Image,
	useToast
} from '@chakra-ui/react';
import { Puff } from 'react-loading-icons';
import { motion } from 'framer-motion';

export default function Answer() {
	const router = useRouter();
	const { id } = router.query;
	const toast = useToast();

	const [peerImp, setPeerImp] = useState(true);
	const [loading, setLoading] = useState(true);
	const [meta, setMeta] = useState({});
	const [conn, setConn] = useState();
	const [chosen, setChosen] = useState({});
	const [radio, setRadio] = useState("");
	const [freeText, setFreeText] = useState("");
	const [submitted, setSubmitted] = useState(false);

	React.useEffect(() => {
		const fn = async () => {
			const PeerJs = (await import('peerjs')).default;
			setPeerImp(false);
			// set it to state here
		}
		fn()
	}, []);

	React.useEffect(() => {
		if (!peerImp && id !== undefined) {
			const peer = new Peer();

			peer.on('open', (pid) => {
				console.log('My peer ID is: ' + pid);
				const conn = peer.connect(id);
				setConn(conn);

				conn.on('open', () => {
					console.log("Connected to peer");
				});

				// Receive the survey info
				conn.on("data", (data) => {
					setMeta(data);
					let temp = {};
					data.choices.map((choice) => {
						temp[choice] = false;
					});
					setChosen(temp);
					setLoading(false);
				});

			});
		}
	}, [peerImp, id])

	const select = (choice, val) => {
		let temp = {...chosen};
		temp[choice] = val;
		setChosen(temp);
	}

	const radioSelect = (val) => {
		setRadio(val);
	}

	const updateFreeText = (e) => {
		setFreeText(e.target.value);
	}

	const submit = () => {
		let temp;
		if (meta.type === "free"){
			if (freeText === "") return;
			temp = freeText;
		}
		else {
			temp = {...chosen}
			if (meta.type === "single"){
				temp[radio] = true;
			}
		}
		conn.send({type: meta.type, data: temp});
		setSubmitted(true);
		toast({
			title: "Response Submitted",
			description: "Respnse was successfully submitted",
			status: "success",
			isClosable: true,
		});
	}

	return (
		<div>
		{(loading && !submitted) &&
			(<div className = "grid justify-center items-center w-screen" style = {{height: "70vh"}}>
				<div>
					<Puff width = {200} />
				</div>
			</div>)
		}

		{(!loading && !submitted) &&	(<div className = "pt-5">
				<Heading size="lg" align="center">{meta.question}</Heading>

				{meta.type === "multiple" && 
					<div className="flex flex-wrap">
						{meta.choices.map((choice, key) => (
							<div key={key} className = "flex-1">
								<Box borderWidth="3px" borderRadius="lg" m = {5} borderColor = {chosen[choice] ? "blue.600" : "default"}>
									<Button h = {70} isFullWidth justifyContent="flex-start" variant = "ghost" onClick = {() => select(choice, !chosen[choice])}>
										<Box>
											<Checkbox onChange = {() => select(choice, chosen[choice])} isChecked = {chosen[choice]}>{choice}</Checkbox>
										</Box>
									</Button>
								</Box>
							</div>
						))}
					</div>}
				
				{meta.type === "single" && 
					<RadioGroup value = {radio}>
						<div className="flex flex-wrap">
								{meta.choices.map((choice, key) => (
									<div key={key} className = "flex-1">
										<Box borderWidth="3px" borderRadius="lg" m = {5} borderColor = {radio === choice ? "blue.600" : "default"}>
											<Button h = {70} isFullWidth justifyContent="flex-start" variant = "ghost" onClick = {() => radioSelect(choice)}>
												<Box>
													<Radio value = {choice} onChange = {() => select(choice)}>{choice}</Radio>
												</Box>
											</Button>
										</Box>
									</div>
								))}
						</div>
					</RadioGroup>}

					{meta.type === "free" &&
						<div className = "flex px-10 pt-5">
							<FormControl>
								<Input onChange = {updateFreeText} value = {freeText}></Input>
							</FormControl>
						</div>
					}
					

					<div className = "text-center mt-5 mb-10">
						<Button onClick={submit} colorScheme="teal">Submit</Button>
					</div>
				</div>)}

			{submitted && (
				<motion.div 
					className = "grid text-center"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition = {{ duration: 0.4 }}
				>
					<div className = "grid justify-center">
						<Image src = "/img/check.png" className = "w-24"/>
					</div>
					
					<Text>Your Response has been recorded!</Text>
				</motion.div>
			)}
		</div>
	)
}