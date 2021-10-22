import React from 'react';
import { useRouter } from 'next/router';
import { Button, Heading } from '@chakra-ui/react';
import { AlertTitle } from '@chakra-ui/alert';
import { data } from 'autoprefixer';

export default function Survey() {
	const router = useRouter();
	const { id } = router.query;
	const [peerImp, setPeerImp] = React.useState(true);
	const [loading, setLoading] = React.useState(true);
	const [meta, setMeta] = React.useState({});
	const [conn, setConn] = React.useState();

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
					setLoading(false)
				});

			});
		}
	}, [peerImp, id])



	const submit = () => {
		conn.send("Submit");
	}

	return (
		loading ?
			(<div>
				<Heading size="md" align="center">Loading...</Heading>
			</div>) :

			(<div>
				{id}
				<Button onClick={submit} >Send Data</Button>

				{meta && <Heading size="md" align="center">{meta.question}</Heading>}
				{meta && JSON.stringify(meta.choices)}
			</div>)
	)
}
