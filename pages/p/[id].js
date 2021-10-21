import React from 'react';
import { useRouter } from 'next/router';
import { Button } from '@chakra-ui/button';
import { AlertTitle } from '@chakra-ui/alert';

export default function Survey() {
    const router = useRouter();
    const { id } = router.query;
    const [loading, setLoading] = React.useState(true);

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

                conn.on('open', () => {
                    console.log("connected");
                });

                // Receive the survey info
                conn.on("data", (data) => {
                    console.log("Received", data);
                });
                
            });
        }
    }, [loading])

    

    const submit = () => {

        
        
    }

    return (
        <div>
            This is a the survey page. {id}
            <Button onClick = {submit} >Send Data</Button>
        </div>
    )
}
