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

	const submit = () => {
		conn.send({type: meta.type, data: chosen});
	}

	return (
		loading ?
			(<div>
				<Heading size="lg" align="center">Loading...</Heading>
			</div>) :

			(<div className = "pt-5">
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

				<div className = "text-center mt-5 mb-10">
					<Button onClick={submit} colorScheme="teal">Submit</Button>
				</div>
			</div>)
	)
}
