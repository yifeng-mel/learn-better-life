// pages/newpage.js
import React from 'react';
import schools from "../src/utils/schools";
import high_schools from '../src/utils/high_schools';
import stations from '../src/utils/stations';
import { useEffect, useState } from 'react';
// import * as turf from '@turf/turf';
import { List, ListItem, ListItemText, Typography, Box } from '@mui/material';

const turf = require('@turf/turf');

const NewPage = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [matchSchools, setMatchSchools] = useState([]);
  const [matchHighSchools, setMatchHighSchools] = useState([]);
  const [nearbyRoads, setNearbyRoads] = useState([]);
  const [nearbyStations, setNearbyStations] = useState([]);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // mount waverly primary school example
          // const latitude = -37.87977526729626
          // const longitude = 145.1251931720104

          const { latitude, longitude } = position.coords;
          setCurrentLocation({ latitude, longitude });

          const point = turf.point([longitude, latitude]);

          // match primary schools
          schools.features.forEach((feature) => {
            const polygon = turf.polygon(feature.geometry.coordinates);
            if (turf.booleanPointInPolygon(point, polygon)) {
              console.log(`Current location is within the catchment of ${feature.properties.name}`);
            }
          });

          var matchedSchools = schools.features.filter((feature) => {
            const polygon = turf.polygon(feature.geometry.coordinates);

            return turf.booleanPointInPolygon(point, polygon);
          })

          setMatchSchools(matchedSchools);

          // match high schools
          high_schools.features.forEach((feature) => {
            const polygon = turf.polygon(feature.geometry.coordinates);
            if (turf.booleanPointInPolygon(point, polygon)) {
              console.log(`Current location is within the catchment of ${feature.properties.name}`);
            }
          });

          var matchedHighSchools = high_schools.features.filter((feature) => {
            const polygon = turf.polygon(feature.geometry.coordinates);

            return turf.booleanPointInPolygon(point, polygon);
          })

          setMatchHighSchools(matchedHighSchools);

          // get nearby roads
          const getNearbyRoads = async () => {
            try {
              const response = await fetch('https://0487-144-138-48-234.ngrok-free.app/get-nearby-roads', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ lat: latitude, long: longitude })
              });
              if (!response.ok) {
                throw new Error('Failed to fetch nearby roads');
              }
              const data = await response.json();
              setNearbyRoads(data);
            } catch (error) {
              console.error('Error fetching nearby roads:', error.message);
            }
          }

          getNearbyRoads();

          // Convert stations data to Turf points
          const turfStations = turf.featureCollection(stations.features.map(station => ({
            type: 'Feature',
            properties: station.properties,
            geometry: {
              type: 'Point',
              coordinates: station.geometry.coordinates
            }
          })));

          // Calculate distances from the given point to all stations
          const distances = turfStations.features.map(station => {
            const distance = turf.distance(point, station, { units: 'kilometers' });
            return { station, distance };
          });

          // Sort stations based on distances
          distances.sort((a, b) => a.distance - b.distance);

          // Select the nearest 3 stations
          const nearestStations = distances.slice(0, 3);
          setNearbyStations(nearestStations)

        },
        (error) => {
          console.error('Error getting current location:', error.message);
        }
      );
    } else {
      console.error('Geolocation is not supported by your browser.');
    }
  }, [schools]);

  return (
    <div>
{currentLocation && (
  <div style={{ padding: '16px', backgroundColor: '#f0f0f0', marginBottom: '16px' }}>
    <Typography variant="h5" gutterBottom align="center">
      Current Location
    </Typography>
    <Typography variant="body1" align="center">
      Latitude: {currentLocation.latitude.toFixed(4)}, Longitude: {currentLocation.longitude.toFixed(4)}
    </Typography>
  </div>
)}

{matchSchools.length > 0 ? (
  <Box mb={2}>
    <List>
      {matchSchools.map((school, index) => (
        <ListItem key={index} divider>
          <ListItemText
            primary={
              <React.Fragment>
                <Typography variant="h6" component="div">
                  {school.properties.School_Name}
                </Typography>
                <Typography variant="body2" color="text.primary">
                  <strong>Overall Score:</strong> {school.properties.overallScore}
                </Typography>
                <Typography variant="body2" color="text.primary">
                  <strong>Enrollments:</strong> {school.properties.totalEnrollments}
                </Typography>
                <Typography variant="body2" color="text.primary">
                  <strong>Postcode:</strong> {school.properties.postcode}
                </Typography>
                <Typography variant="body2" color="text.primary">
                  <strong>Percentile:</strong> {school.properties.percentile}
                </Typography>
                <Typography variant="body2" color="text.primary">
                  <strong>ICSEA:</strong> {school.properties.icsea}
                </Typography>
              </React.Fragment>
            }
          />
        </ListItem>
      ))}
    </List>
  </Box>
) : (
  <Typography variant="h6" color="textSecondary" style={{ padding: '16px', textAlign: 'center' }}>
    No top primary schools found
  </Typography>
)}

{matchHighSchools.length > 0 ? (
  <Box mb={2}>
    <List>
      {matchHighSchools.map((school, index) => (
        <ListItem key={index} divider>
          <ListItemText
            primary={
              <React.Fragment>
                <Typography variant="h6" component="div">
                  {school.properties.School_Name}
                </Typography>
                <Typography variant="body2" color="text.primary">
                  <strong>Overall Score:</strong> {school.properties.overallScore}
                </Typography>
                <Typography variant="body2" color="text.primary">
                  <strong>Enrollments:</strong> {school.properties.totalEnrollments}
                </Typography>
                <Typography variant="body2" color="text.primary">
                  <strong>Postcode:</strong> {school.properties.postcode}
                </Typography>
                <Typography variant="body2" color="text.primary">
                  <strong>Percentile:</strong> {school.properties.percentile}
                </Typography>
                <Typography variant="body2" color="text.primary">
                  <strong>ICSEA:</strong> {school.properties.icsea}
                </Typography>
              </React.Fragment>
            }
          />
        </ListItem>
      ))}
    </List>
  </Box>
) : (
  <Typography variant="h6" color="textSecondary" style={{ padding: '16px', textAlign: 'center' }}>
    No top high schools found
  </Typography>
)}

{nearbyRoads.length > 0 ? (
  <Box mb={2}>
    <List>
      {nearbyRoads.map((road, index) => (
        <ListItem key={index} divider>
          <ListItemText
            primary={road.roadName}
            secondary={`Distance: ${road.distance.toFixed(2)} meters`}
          />
        </ListItem>
      ))}
    </List>
  </Box>
) : (
  <Typography variant="h6" color="textSecondary" style={{ padding: '16px', textAlign: 'center' }}>
    No nearby roads found
  </Typography>
)}

{nearbyStations.length > 0 ? (
  <Box mb={2}>
    <List>
      {nearbyStations.map((nearest, index) => (
        <ListItem key={index} divider>
          <ListItemText
            primary={nearest.station.properties.STOP_NAME}
            secondary={`Distance: ${nearest.distance.toFixed(2)} kilometers`}
          />
        </ListItem>
      ))}
    </List>
  </Box>
) : (
  <Typography variant="h6" color="textSecondary" style={{ padding: '16px', textAlign: 'center' }}>
    No nearby stations found
  </Typography>
)}


    </div>
  );
};

export default NewPage;
