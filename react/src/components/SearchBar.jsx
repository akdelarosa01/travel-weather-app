import React, {useEffect, useState, useRef, useCallback} from "react";
import {
    Box,
    Flex,
    HStack,
    Button,
    useColorModeValue,
    FormControl,
	FormLabel,
	FormErrorMessage,
    Input,
    InputGroup,
    InputLeftElement,
    useToast,
    Select,
	Stack,
	Drawer,
	DrawerBody,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
	DrawerContent,
	DrawerCloseButton,
	useDisclosure,
	Skeleton,
} from "@chakra-ui/react";
import { SearchIcon, EditIcon, AddIcon, DeleteIcon } from "@chakra-ui/icons";
import axiosRequest from "../../axiosRequest";
import cities from "../data/cities";
import countries from "../data/countries";
import { useParams } from "react-router-dom";

export default function SearchBar(props) {
	const toast = useToast();
	let {cityVal} = useParams();
	const [savedCities, setSavedCities] = useState([]);
	const [selectCity, setSelectCity] = useState([]);
	const [countryInputError, setCountryInputError] = useState(false);
	const [countryErrorMsg, setCountryErrorMsg] = useState('');
	
	const [cityInputError, setCityInputError] = useState(false);
	const [cityErrorMsg, setCityErrorMsg] = useState('');

	const [cityOption, setCityOption] = useState([]);
	const [loading, setLoading] = useState(true);
	const [skeletonLoading, setSkeletonLoading] = useState(false);

	const { isOpen, onOpen, onClose } = useDisclosure()
	const btnRef = useRef()

	const msgHandler = (data) => {
		let msgStatus = data.status;

		if (!data.hasOwnProperty('status')) {
			msgStatus = data.name;
		}
        switch (msgStatus) {
            case "success":
                toast({
                    title: "Success",
                    description: data.message,
                    status: data.status,
                    position: "top",
                    variant: "subtle",
                    isClosable: true,
                });
                break;
            case "warning":
                toast({
                    title: "Warning",
                    description: data.message,
                    status: data.status,
                    position: "top",
                    variant: "subtle",
                    isClosable: true,
                });
                break;

            case "error":
                toast({
                    title: "Error",
                    description: data.message,
                    status: data.status,
                    position: "top",
                    variant: "subtle",
                    isClosable: true,
                });
                break;

            default:
				toast({
                    title: "Error",
                    description: data.message,
                    status: 'error',
                    position: "top",
                    variant: "subtle",
                    isClosable: true,
                });
                break;
                break;
        }
    };

	const handleSelectCity = (e) => {
		if (e.target.value) {
			setCityInputError(false);
		}
	}

	const handleSelectCountry = (e) => {
		if (e.target.value) {
			setCountryInputError(false);
		}
		const selectedCountry = e.target.value.toLocaleLowerCase();
		const cityOps = cities.filter( (c) => {
			return c.country.toLocaleLowerCase().includes(selectedCountry);
		});

		const city = cityOps[0].city;
		const cityList = [...new Set(city.map(ci => ci.city_name))];

		setCityOption(cityList);
	}

	const getSavedCities = async () => {
		await axiosRequest.get('/cities').then(({data}) => {
			setSavedCities(data);

			if (props.city != null) {
				const citySelection = document.getElementById('citySelection');
				citySelection.value = props.city;
			}
			setLoading(false);
			setSkeletonLoading(true);
		}).catch((error) => {
			setLoading(false);
			msgHandler(error);
		});
	}

	const country_ref = useRef();
	const city_ref = useRef();

	const onSave = (e) => {
		setLoading(true);
		setCountryInputError(false);
		setCityInputError(false);

		e.preventDefault();

		const countryCode = country_ref.current[country_ref.current.selectedIndex].getAttribute('data-code');
		const param = {
			country: country_ref.current.value,
			country_code: countryCode,
			city: city_ref.current.value
		}

		axiosRequest.post('/cities', param).then(({data}) => {
			handleUpdateWeatherDisplay(data.data);
			setLoading(false);			
			msgHandler(data);
		}).catch((err) => {
			if (err && err.hasOwnProperty('response')) {
				if(err.response.hasOwnProperty('status') && err.response.status == 422) {
					handleFormError(err.response.data.errors)
				}
			}
			console.log(err.response);
			setLoading(false);
		});
	}

	const handleUpdateWeatherDisplay = useCallback((data) => {
		props.onUpdateDisplay(data.data);
    },[props.onUpdateDisplay])

	const onSearch = useCallback((data) => {
		setLoading(true);
		const selectedCity = document.getElementById('citySelection').value;
		const interestInput = document.getElementById('interestInput').value;
		
		let link = `/cities/${selectedCity}/${interestInput}`;
		
		if (interestInput == undefined && interestInput == null || interestInput == "") {
			link = `/cities/${selectedCity}`;
		}
		axiosRequest.get(link).then(({data}) => {
			props.onUpdateDisplay(data.results);
			setLoading(false);
		}).catch((err) => {
			
			setLoading(false);
			msgHandler(err);
		});
    },[props.onUpdateDisplay])

	const handleFormError = (err) => {
		if (err.hasOwnProperty('country')) {
			let errMsg = "";
			err.country.map((e) => {
				errMsg += e+' ';
			})

			setCountryInputError(true);
			setCountryErrorMsg(errMsg)
		}

		if (err.hasOwnProperty('city')) {
			let errMsg = "";
			err.city.map((e) => {
				errMsg += e+' ';
			})

			setCityInputError(true)
			setCityErrorMsg(errMsg)
		}
	}

	useEffect(() => {
		getSavedCities();
	}, []);

	return (
		<div>
			<Box bg={"white"} boxShadow="xs" py="1">
				<Flex
					px={{ base: 4 }}
					borderStyle={"solid"}
					borderColor={useColorModeValue("gray.200", "gray.900")}
					align={"center"}
				>
					<Flex
						flex={{ base: 1 }}
						justify={{ base: "center", md: "start" }}
					>
						<HStack
							flex={{ base: 4, md: 0 }}
							justify={"flex-start"}
							direction={"row"}
							spacing={1}
						>
							{
								props.title == 'Map'? '' : (
									<Box width="100px">
										<Button
											variant={"outline"}
											colorScheme={"blue"}
											borderRadius={"0px"}
											aria-label="Add Item"
											size="sm"
											title="Click this buton to add a City"
											ref={btnRef}
											onClick={onOpen}
											leftIcon={<AddIcon />}
											isLoading={loading} 
											spinnerPlacement='end'
										>
											Add City
										</Button>
									</Box>
								)
								
							}
						</HStack>
					</Flex>

					{
						props.title == 'Map'?
						
						(
							<HStack
								flex={{ base: 10, lg: 1 }}
								justify={"flex-end"}
								direction={"row"}
								spacing={2}
							>
								<Box width="100%">
									<Skeleton isLoaded={skeletonLoading}>
									
										<Select
											placeholder="Select City"
											size="sm"
											id="citySelection"
										>
											{savedCities.map((c) => (
												<option key={c.id} value={c.city}>
													{c.city}
												</option>
											))}
										</Select>
									</Skeleton>
								</Box>

								
								<Box width="100%">
									<Skeleton isLoaded={skeletonLoading}>
										<InputGroup>
											<InputLeftElement
												pointerEvents="none"
												children={<SearchIcon color="gray.300" />}
											/>
											<Input
												type="text"
												placeholder="Search Interest ex. Cafe, Restaurant, etc."
												size={"sm"}
												w={"100%"}
												id="interestInput"
											/>
										</InputGroup>
									</Skeleton>
								</Box>

								<Box width="100px">
										<Button
											variant={"outline"}
											colorScheme={"blue"}
											borderRadius={"0px"}
											aria-label="Search"
											size="sm"
											title="Click this buton to Search your interest"
											ref={btnRef}
											onClick={onSearch}
											leftIcon={<SearchIcon />}
											isLoading={loading} 
											spinnerPlacement='end'
										>
											Search
										</Button>
									</Box>
								
							</HStack>
						) : ''
					}
					
				</Flex>
			</Box>
			<Drawer
				isOpen={isOpen}
				placement='right'
				onClose={onClose}
				finalFocusRef={btnRef}
			>
				<DrawerOverlay />
				<DrawerContent>
					<DrawerCloseButton />
					<DrawerHeader>Add another City</DrawerHeader>

					<form id="frmCity" onSubmit={onSave}>
						<DrawerBody>
							<Stack direction={'column'} spacing={2}>
								
								<Box w='100%'>
									<FormControl isInvalid={countryInputError}>
										<FormLabel>Country</FormLabel>
										<Select
											placeholder="Select Country"
											size="sm"
											onChange={handleSelectCountry}
											name="country"
											ref={country_ref}
										>
											{countries.map((cnt) => (
												<option key={cnt.name} value={cnt.name} data-code={cnt.code}>
													{cnt.name}
												</option>
											))}
										</Select>
										{countryInputError ? (
											<FormErrorMessage>{countryErrorMsg}</FormErrorMessage>
										) : ''}
									</FormControl>
									
								</Box>
							
								<Box w='100%'>
									<FormControl isInvalid={cityInputError}>
										<FormLabel>City</FormLabel>
										<Select
											placeholder="Select City"
											size="sm"
											onChange={handleSelectCity}
											name="city"
											ref={city_ref}
										>
											{cityOption.map((city_name, indx) => (
												<option key={indx} value={city_name}>
													{city_name}
												</option>
											))}
										</Select>
										{cityInputError ? (
											<FormErrorMessage>{cityErrorMsg}</FormErrorMessage>
										) : ''}
									</FormControl>

									
								</Box>
								
							</Stack>
						</DrawerBody>

						<DrawerFooter>
							<Button variant='outline' mr={3} onClick={onClose}>
								Cancel
							</Button>
							<Button type='submit' 
								colorScheme='blue' 
								variant='outline'
								isLoading={loading}
								spinnerPlacement='end'
							>Save</Button>
						</DrawerFooter>
					</form>
				</DrawerContent>
			</Drawer>
		</div>
		
	);
}
