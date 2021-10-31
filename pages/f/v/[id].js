import React, {useState, useEffect} from 'react';
import { useRouter } from 'next/router';
import { 
	Heading,
	Box,
	Table,
	Thead,
	Tr,
	Th,
	Td,
	Tbody
} from '@chakra-ui/react';

export default function Share() {
	const router = useRouter();
	const { id } = router.query;

	const [loading, setLoading] = useState(true);
	const [data, setData] = useState({});

	useEffect(() => {
		const getData = async() => {
			await fetch(`https://qr-tools-save.tinu-personal.workers.dev/${id}`).then(
				(res) => res.json()
			).then((data) => {
				console.log(data)
				setData(JSON.parse(data.data));
				setLoading(false);
			})
		}

		if (id !== undefined){
			getData();
		}
  }, [id]);

	return (
		loading ? 
		<div>
			Loading...
		</div> :

		<div>
			<div className = "grid justify-items-center">
				<Heading size="lg" align="center" m = {5}>
					{data.name}
				</Heading>
			</div>

			<Box borderWidth = "3px" borderRadius="lg" className = "mx-32">
				<Table variant="simple">
					<Thead>
						<Tr>
							{Object.keys(data.data[0]).map((field, key) => 
								<Th key = {key}>{field}</Th>
							)}
						</Tr>
					</Thead>
					<Tbody>
						{Object.keys(data.data).map((row, key) => 
							<Tr key = {key}>
								{Object.keys(data.data[0]).map((field, fKey) => 
									<Td key = {fKey}>{data.data[row][field]}</Td>
								)}
							</Tr>
						)}
					</Tbody>
				</Table>
			</Box>
		</div>
	)
}
