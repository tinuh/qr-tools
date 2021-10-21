import React from 'react';
import { useRouter } from 'next/router';
import { Button } from '@chakra-ui/button';
import { AlertTitle } from '@chakra-ui/alert';
import { data } from 'autoprefixer';

export default function Survey() {
    const router = useRouter();
    const { id } = router.query;
    const [loading, setLoading] = React.useState(true);
    const [meta, setMeta] = React.useState({});
    const [conn, setConn] = React.useState();

    React.useEffect(() => {
        const fn = async () => {
          const PeerJs = (await import('peerjs')).default;
          setLoading(false);
          // set it to state here
        }
        fn()
    }, []);

    React.useEffect(() => {
        if (!loading) {
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
                });
                
            });
        }
    }, [loading])

    

    const submit = () => {
        conn.send("Submit");
    }

    return (
        <div>
            This is the sample poll page. {id}
            <Button onClick = {submit} >Send Data</Button>

            {meta && meta.question}
        </div>
    )
}
