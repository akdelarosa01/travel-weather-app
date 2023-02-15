import React, {useState,useEffect} from "react";
import Header from "./Header";
import SearchBar from "./SearchBar";
import {
    Container,
	SimpleGrid,
    Box,
    Stack,
	AspectRatio,
    Skeleton,
    Card,
	CardHeader,
	CardBody,
    useToast,
	Flex,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Heading,
	Text,
	IconButton,
	Image,
	HStack
} from "@chakra-ui/react";
import { CheckIcon, RepeatIcon, DeleteIcon } from "@chakra-ui/icons";
import { MdSettings, MdMap, MdMoving  } from 'react-icons/md';
import axiosRequest from "../../axiosRequest";
import BgImg from "../assets/weatherBg.jpg";
import { Link } from "react-router-dom";


export default function Home() {
	const [weatherSkeleton, setWeatherSkeleton] = useState(false);
	const gradiantColor = 'linear(to-r, green.200, teal.400)';
	const [cityWeathers, setCityWeathers] = useState([]);
	const [loading, setLoading] = useState(false);
	const color = 'white';

	const getCityWeathers = async () => {
		await axiosRequest.get('/cities').then(({data}) => {
			setCityWeathers(data);
			setWeatherSkeleton(true);
		}).catch((error) => {
			console.log(error);
		});
	}

	const capitalizeFirstLetter = (word) => {
		return word.charAt(0).toUpperCase() + word.slice(1);
	}

	const onDelete = (id) => {
		setLoading(true);
		axiosRequest.delete(`/cities/${id}`).then(({data}) => {
			setCityWeathers(data);
			setLoading(false);
		}).catch((err) => {
			console.log(err);
			setLoading(false);
		});
	}

	useEffect( () => {
		getCityWeathers();
	});

	return (
		<div>
			<Header />
			<SearchBar title={'City'} city={null}/>

			<Container maxW='10xl' maxH={'100%'}>
				<Box w={'100%'}>
					<SimpleGrid columns={[1,2,3]} spacing={5} pt={5}>
						{
							cityWeathers && cityWeathers.map((w) => (
								<Box w='100%' key={w.id}>
									<Card backgroundImage={BgImg} boxShadow='md' rounded='md'> {/* bgGradient={gradiantColor} */}
										<CardHeader>
											<Flex spacing='4'>
												<Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
													<Box>
														<Heading size='md' color={color}>{w.city}</Heading>
														<Text color={color}>{w.country}</Text>
													</Box>
													
												</Flex>
												
												<Menu>
													<MenuButton
														as={IconButton}
														variant='ghost'
														color={'white'}
														aria-label='Settings'
														icon={<MdSettings />}
														isLoading={loading}
														spinnerPlacement='end'
														_hover={{
															color: 'gray'
														}}
													/>
													<MenuList>
														<MenuItem icon={<DeleteIcon />} onClick={() => onDelete(w.id)}>
															Delete
														</MenuItem>
														<MenuItem icon={<MdMoving />} as={Link} to={'/map/'+w.city+', '+w.country_code}>
															Venues
														</MenuItem>
													</MenuList>
												</Menu>
											</Flex>
										</CardHeader>
										<CardBody>
											<Stack direction={'row'}>
												<Box width={'50%'}>
													<Text sx={{
														fontSize: 16,
														fontWeight: '600'
													}} color={color}>{w.weather_main}</Text>
													<Image boxSize='50px' 
														src={"http://openweathermap.org/img/wn/"+w.weather_icon+".png"} 
														alt={w.city} 
													/>
												</Box>
												<Box width={'25%'}>
													<Box fontSize={13} color={color}>Max. Temp: {w.temp_max}</Box>
													<Box fontSize={13} color={color}>Min. Temp: {w.temp_min}</Box>
													<Box fontSize={13} color={color}>Humidity: {w.humidity}&#176;</Box>
												</Box>
												<Box width={'25%'}>
													<Heading size='xl' color={color}>{w.temp}&#176;</Heading>
												</Box>
											</Stack>
											<Text fontSize={13} color={color}>{ capitalizeFirstLetter(w.weather_description) }</Text>
										</CardBody>
									</Card>
								</Box>
							))
						}
					</SimpleGrid>
				</Box>
			
			</Container>


		</div>
	)
}
