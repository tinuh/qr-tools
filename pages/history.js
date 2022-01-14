import React from "react";
import { 
	Box, 
	Heading, 
	Text,
	Button,
	Flex,
	Spacer,
	Tooltip,
	AlertDialog,
	AlertDialogOverlay,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogBody,
	AlertDialogFooter,
	useToast,
	Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
	useDisclosure,
	ButtonGroup,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td
} from "@chakra-ui/react";
import { CSVLink } from "react-csv";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faShareAlt, faTrash, faDownload } from "@fortawesome/free-solid-svg-icons";
import { ThreeDots } from 'react-loading-icons';
import { Pie, Bar } from "react-chartjs-2";

export default function History() {
	const toast = useToast();
	const { isOpen, onOpen, onClose} = useDisclosure();

	const [open, setOpen] = React.useState(false);
	const [id, setId] = React.useState(0);
	const [data, setData] = React.useState([]);
	const [sharing, setSharing] = React.useState(false);
	const [modalData, setModalData] = React.useState({});
	const [chartType, setChart] = React.useState('pie');

	React.useEffect(() => {
		let raw = localStorage.getItem('history');
		if (raw !== null){
			setData(JSON.parse(raw).reverse());
		}
	}, [])

	const deleteButton = (id) => {
		setOpen(true);
		setId(id);
	}

	const deleteItem = () => {
		let temp = [...data];
		temp.splice(id, 1);
		setData(temp);
		setOpen(false);
		localStorage.setItem('history', JSON.stringify([...temp].reverse()));
	}

	//method to save data to cloudflare KV using workers
	const share = async(data, id) => {
		setId(id);
		setSharing(true);
		await fetch("https://qr-tools-save.tinu-personal.workers.dev", {
			method: "POST",
			mode: "cors",
			cache: "no-cache",
			headers   : {
				'Content-Type': 'application/json',
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
				"Access-Control-Max-Age": "86400",
			},
			referrerPolicy: "no-referrer",
			body: JSON.stringify(data)
		}).then(res => res.json()).then(res => {
			console.log(res);
			let link = `${process.env.NEXT_PUBLIC_URI}/${data.name ? "f" : "p"}/v/${res.key}`;

			try {
				navigator.clipboard.writeText(link);

				toast({
					title: "Copied to Clipboard",
					description: "The sharing link is copied to clipboard",
					status: "success",
					isClosable: true,
				})
				setSharing(false);
			}
			catch{
				toast({
						title: "Error",
						description: "Error copying to clipboard",
						status: "error",
						isClosable: true,
				})
			}
		});
	}

	const view = (data) => {
		setModalData(data);
		onOpen();


	}

  return (
		<div>
			<AlertDialog
        isOpen={open}
        onClose={() => setOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Delete Item
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can&apos;t undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button colorScheme='red' onClick={deleteItem} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

			<Modal size = "xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{modalData.question || modalData.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {modalData && modalData.question ? 
							<div className="grid justify-items-center">
								{((modalData.type === "single" || modalData.type === "multiple") && modalData.data)&& 
									<div className="mt-5 w-5/6 text-center">
										<ButtonGroup isAttached mb={10}>
											<Button mr="-px" onClick = {() => setChart('pie')}>Pie</Button>
											<Button onClick = {() => setChart('bar')}>Bar</Button>
										</ButtonGroup>
										{chartType === 'pie' && <Pie data={{
												labels: Object.keys(modalData.data),
												datasets: [
													{
														label: "# of votes",
														data: Object.values(modalData.data),
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
											}} />}
											{chartType === 'bar' && <Bar data={{
												labels: Object.keys(modalData.data),
												datasets: [
													{
														label: "# of votes",
														data: Object.values(modalData.data),
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
											}} />}
									</div>}
								{modalData.type === "free" && 
									<div>
										<div className = "flex flex-wrap">
										{modalData.data.map((res, key) => 
											<Box key = {key} p = {3} m= {3} borderWidth = "2px" borderRadius="lg">
												{res}
											</Box>)}
										</div>
									</div>}
							</div> :

							<div>
								{modalData.data && <Box borderWidth = "3px" borderRadius="lg">
									<Table variant="simple">
										<Thead>
											<Tr>
												{Object.keys(modalData.data[0]).map((field, key) => 
													<Th key = {key}>{field}</Th>
												)}
											</Tr>
										</Thead>
										<Tbody>
											{Object.keys(modalData.data).map((row, key) => 
												<Tr key = {key}>
													{Object.keys(modalData.data[0]).map((field, fKey) => 
														<Td key = {fKey}>{modalData.data[row][field]}</Td>
													)}
												</Tr>
											)}
										</Tbody>
									</Table>
								</Box>}
							</div>
						}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

			<div className="flex">
				<Box w = "60%" m = {10}>
					<Heading size="lg" align="center" mb = {10}>
						History
					</Heading>
					
					{data.map((item, key) => (
						<Box key = {key} borderWidth='3px' borderRadius='lg' mb = {5}>
							<Flex>
								<Box>
									<Heading size = "md" mx = {5} mt = {5}>	
										{item.question || item.name}
									</Heading>
									<Text ml = {5} mt = {3} mb = {5}>
										{item.date}
									</Text>
								</Box>

								<Spacer />

								<Flex m = {3} textAlign={"center"} justifyContent={"center"} alignItems={"center"}>
									<Tooltip label = "View Results">
										<Button m = {2} colorScheme="teal" onClick={() => view(item)}>
											<FontAwesomeIcon icon={faEye}/>
										</Button>
									</Tooltip>
									<Tooltip label = "Share Results">
										<Button m = {2} colorScheme="teal" onClick={() => share(item, key)} disabled = {sharing && id === key}>
											{sharing && id === key ? <ThreeDots width = {50} /> : <FontAwesomeIcon icon={faShareAlt}/>}
										</Button>
									</Tooltip>
									<CSVLink 
										data = {
											item.type === "free" ?
											[
												[item.question],
												[],
												item.data
											] :
											[
												[item.question],
												[],
												Object.keys(item.data),
												Object.values(item.data)
											]
										}
										filename = {`QR Tools - ${item.question}.csv`}
										>
										<Tooltip label = "Download Results">
											<Button m = {2} colorScheme="teal" >
												<FontAwesomeIcon icon={faDownload}/>
											</Button>
										</Tooltip>
									</CSVLink>
									<Tooltip label = "Delete">
										<Button m = {2} colorScheme="red" onClick = {() => deleteButton(key)}>
											<FontAwesomeIcon icon={faTrash}/>
										</Button>
									</Tooltip>
								</Flex>
							</Flex>
						</Box>
					))}
				</Box>
			</div>
		</div>
  );
}
