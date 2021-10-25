import React from 'react';
import { useRouter } from 'next/router';
import {
	Button,
	Heading,
	FormControl,
	FormLabel,
	Input
} from '@chakra-ui/react';
import { useForm } from "react-hook-form";

export default function Form() {
	const router = useRouter();
	const { id } = router.query;
	const [peerImp, setPeerImp] = React.useState(true);
	const [loading, setLoading] = React.useState(true);
	const [meta, setMeta] = React.useState({});
	const [conn, setConn] = React.useState();

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
	}

	return (
		loading ?
			(<div>
				<Heading size="lg" align="center">Loading...</Heading>
			</div>) :

			(<div className="pt-5">
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
			</div>)
	)
}