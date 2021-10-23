import React from 'react';
import { useRouter } from 'next/router';
import { Button, Heading, Box, Checkbox } from '@chakra-ui/react';

export default function Survey() {
	const router = useRouter();
	const { id } = router.query;
	const [peerImp, setPeerImp] = React.useState(true);
	const [loading, setLoading] = React.useState(true);
	const [meta, setMeta] = React.useState({});
	const [conn, setConn] = React.useState();
	const [chosen, setChosen] = React.useState({});

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

				// Receive the survey info
				conn.on("data", (data) => {
					setMeta(data);
					data.choices.map((choice) => {
						setChosen({...chosen, [choice]: false})
					});
					setLoading(false);
				});

			});
		}
	}, [peerImp, id])

	const select = (choice) => {
		
		console.log(choice);
	}

	const submit = () => {
		conn.send("Submit");
	}

	return (
		loading ?
			(<div>
				<Heading size="lg" align="center">Loading...</Heading>
			</div>) :

			(<div>
				{id}


				<Heading size="lg" align="center">{meta.question}</Heading>

				<div className="flex">
					{meta.choices.map((choice, key) => (
						<div key={key}>
							<Box borderWidth="3px" borderRadius="lg" m = {5}>
								<Button h = "70" variant = "ghost">
									<Box p={5}>
										<Checkbox onChange = {() => select(choice)}>{choice}</Checkbox>
									</Box>
								</Button>
							</Box>
							<br />
						</div>
					))}
				</div>

				<Button onClick={submit} colorScheme="teal">Submit</Button>
			</div>)
	)
}
