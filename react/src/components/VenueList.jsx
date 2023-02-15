import React, { useEffect, useState, useCallback } from "react";
import {
    Box,
    Text,
	Skeleton,
	Card,
	CardHeader,
	Heading,
	CardBody,
	VStack,
	Link
} from "@chakra-ui/react";

export default function VenueList(props) {
	const [locations, setLocations] = useState();

	const handleMapView = useCallback((lat,lon) => {

		props.onUpdateMap({
			latitude: lat,
			longitude: lon
		});

		console.log({
			latitude: lat,
			longitude: lon
		});
    },[props.onUpdateDisplay])

	useEffect( () => {
		setLocations(props.locations);
		console.log(props.locations)
	});
	return (
		<div>

			{
				locations && locations.map((c) => (
					<Card key={c.fsq_id} 
						as={Link}
						variant={'outline'} 
						mb={2} 
						onClick={ () => {handleMapView(c.geocodes.main.latitude,c.geocodes.main.longitude)}}
						sx={{
							_hover: {
								textDecor: 'none',
								color: 'teal.400'
							}
						}}
					>
						<CardHeader pb={2}>
							<Heading size='md'> {c.name}</Heading>
						</CardHeader>
						<CardBody pt={1}>
							
							<VStack align={'self-start'} spacing={5}>
								<Text sx={{
									color: '#6B728E'
								}}>{c.location.formatted_address}</Text>
								<Text as='sub' sx={{
									color: '#6B728E'
								}}>{c.location.locality + ', '+ c.location.region + ', '+ c.location.country}</Text>
								<Text as='sub' sx={{
									color: '#6B728E'
								}}>{'Lat: ' +c.geocodes.main.latitude+ ', Lon: ' +c.geocodes.main.longitude}</Text>
							</VStack>
						</CardBody>
					</Card>
					
				))
			}
			
		</div>
	);
}
