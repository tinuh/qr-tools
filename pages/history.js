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
	AlertDialogFooter
} from "@chakra-ui/react";
import { CSVLink } from "react-csv";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faShareAlt, faTrash } from "@fortawesome/free-solid-svg-icons";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

export default function History() {
	const [open, setOpen] = React.useState(false);
	const [id, setId] = React.useState(0);
	const [data, setData] = React.useState([]);

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
		localStorage.setItem('history', JSON.stringify(temp.reverse()));
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
              Are you sure? You can't undo this action afterwards.
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
										<Button m = {2} colorScheme="teal">
											<FontAwesomeIcon icon={faEye}/>
										</Button>
									</Tooltip>
									<Tooltip label = "Share Results">
										<Button m = {2} colorScheme="teal" >
											<FontAwesomeIcon icon={faShareAlt}/>
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
