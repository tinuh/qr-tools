import React, { useState } from 'react';
import { useRouter } from 'next/router';
import {
	Button,
	Heading,
	FormControl,
	FormLabel,
	Input,
	useToast,
	Image,
	Text
} from '@chakra-ui/react';
import { useForm } from "react-hook-form";
import { Puff } from 'react-loading-icons';
import { motion } from 'framer-motion';

export default function Form() {
	const router = useRouter();
	const { id } = router.query;
	const toast = useToast();

	const [peerImp, setPeerImp] = useState(true);
	const [loading, setLoading] = useState(true);
	const [meta, setMeta] = useState({});
	const [conn, setConn] = useState();
	const [submitted, setSubmitted] = useState(false);

	const { register, handleSubmit, watch, formState: { errors } } = useForm();

	React.useEffect(() => {
		const fn = async () => {
			const PeerJs = (await import('peerjs')).default;
			setPeerImp(false);
			// set it to state here
		}
		fn()
	}, []);

	React.useEffect(() => {
		if (!peerImp) {
			const peer = new Peer();

			peer.on('open', (pid) => {
				console.log('My peer ID is: ' + pid);
				const conn = peer.connect(id);
				setConn(conn);

				conn.on('open', () => {
					console.log("Connected to peer");
				});

				// Receive the form info
				conn.on("data", (data) => {
					setMeta(data);
					setLoading(false);
				});

			});
		}
	}, [peerImp, id])

	const submit = (data) => {
		console.log(data);
		conn.send(data);
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
			{(loading && !submitted) && (<div className = "grid justify-center items-center w-screen" style = {{height: "70vh"}}>
				<div>
					<Puff width = {200} />
				</div>
			</div>)}

			{(!loading && !submitted) && (<div className="pt-5">
				<Heading size="lg" align="center">{meta.name}</Heading>

				<form onSubmit={handleSubmit(submit)}>

					<div className="px-10 pt-5">
						{meta.fields.map((field, key) =>
							<div className = "pb-5" key = {key}>
								<FormControl>
									<FormLabel>{field}</FormLabel>
									<Input {...register(field)} placeholder={field}></Input>
								</FormControl>
							</div>
						)}
					</div>

				<div className="text-center mb-10">
					<Button type = "submit" colorScheme="teal">Submit</Button>
				</div>

				</form>
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