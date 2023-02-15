import React, { useEffect, useState } from "react";
import {
	Container,
	Skeleton,
	Grid,
	GridItem
} from "@chakra-ui/react";
import Header from "./Header";
import SearchBar from "./SearchBar";
import VenueList from "./VenueList";
import MapView from "./MapView";
import { useParams } from "react-router-dom";
import axiosRequest from "../../axiosRequest";


export default function MapLayout() {
	let {city,interest} = useParams();
	const [locations, setLocations] = useState([]);
	const [skeletonLoading, setSkeletonLoading] = useState(false);
	const [showMap, setShowMap] = useState(false);
	const [geos, setGeos] = useState({
        latitude: 36.2048,
        longitude: 138.2529
    });

	const mapIsReadyCallback = (map) => {
        console.log(map);
    };

	const getVenues = () => {
		let link = `/cities/${city}/${interest}`;
		
		if (interest == undefined) {
			link = `/cities/${city}`;
		}
		axiosRequest.get(link).then(({data}) => {
			setLocations(data.results);
			setShowMap(true);
			setSkeletonLoading(true);
		}).catch((err) => {
			console.log(err);
		});
	}

	useEffect( () => {
		getVenues();
	}, []);

	return (
		<div>
			<Header />
			<SearchBar title={"Map"} city={city} onUpdateDisplay={setLocations}/>

			<Container maxW="12xl" maxH={"100%"} mt='10px'>
				<Grid
					h='100%'
					templateRows='repeat(2, 1fr)'
					templateColumns='repeat(6, 1fr)'
					gap={3}
					mb='15px'
					as={'section'}
				>
					<GridItem rowSpan={2} colSpan={2} as={'section'} sx={{
						overflow: 'auto'
					}}>
						{
							(locations.length > 0)? (
								<VenueList locations={locations} onUpdateMap={setGeos}/>
							) : (
								<Skeleton width={'100%'} height={'100%'}></Skeleton>
							)
						}
						
					</GridItem>

					<GridItem colSpan={4}>
						{
							showMap && <MapView mapIsReadyCallback={mapIsReadyCallback} latitude={geos.latitude} longitude={geos.longitude}/>
						}
					</GridItem>
				</Grid>
			</Container>
		</div>
	);
}
