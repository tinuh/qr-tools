import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Heading, ButtonGroup, Button, Box } from "@chakra-ui/react";
import { Bar, Pie } from "react-chartjs-2";

export default function Share() {
  const router = useRouter();
  const { id } = router.query;

 	const [loading, setLoading] = useState(true);
	const [data, setData] = useState({});
	const [chartType, setChart] = useState('pie');

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


	const graphData = loading ? [] : {
		labels: Object.keys(data.data),
		datasets: [
			{
				label: "# of votes",
				data: Object.values(data.data),
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


  return loading ? 
		<div>
			Loading...
		</div> : 
		<div>
			<div className = "grid justify-items-center">
				<Heading size="lg" align="center" m = {5}>
					{data.question}
				</Heading>

				{(data.type === "single" || data.type === "multiple") && 
					<div className="mt-5 w-1/3 text-center">
						<ButtonGroup isAttached mb={10}>
							<Button mr="-px" onClick = {() => setChart('pie')}>Pie</Button>
							<Button onClick = {() => setChart('bar')}>Bar</Button>
						</ButtonGroup>
						{chartType === 'pie' && <Pie data={graphData} />}
						{chartType === 'bar' && <Bar data={graphData} />}
					</div>}
				{data.type === "free" && 
					<div>
						<div className = "flex flex-wrap mt-5">
						{data.data.map((res, key) => 
							<Box key = {key} p = {3} borderWidth = "2px" borderRadius="lg">
								{res}
							</Box>)}
						</div>
					</div>}
			</div>
			
		</div>;
}