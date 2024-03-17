// pages/newpage.js
import React from 'react';
import schools from "../src/utils/schools";
import high_schools from '../src/utils/high_schools';
import { useEffect, useState } from 'react';
import * as turf from '@turf/turf';
import { List, ListItem, ListItemText, Typography } from '@mui/material';

const NewPage = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [matchSchools, setMatchSchools] = useState([]);
  const [matchHighSchools, setMatchHighSchools] = useState([]);
  const [nearbyRoads, setNearbyRoads] = useState([]);

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
        <div style={{ padding: '16px', backgroundColor: '#f0f0f0' }}>
          <Typography variant="h5" gutterBottom>
            Current Location
          </Typography>
          <Typography variant="body1">
            Latitude: {currentLocation.latitude.toFixed(4)}, Longitude: {currentLocation.longitude.toFixed(4)}
          </Typography>
        </div>
      )}

      {matchSchools.length > 0 ? (
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
      ) : (
        <Typography variant="h6" color="textSecondary" style={{ padding: '16px' }}>
          No school found
        </Typography>
      )}

      {matchHighSchools.length > 0 ? (
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
      ) : (
        <Typography variant="h6" color="textSecondary" style={{ padding: '16px' }}>
          No high school found
        </Typography>
      )}

      {nearbyRoads.length > 0 ? (
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
      ) : (
        <Typography variant="h6" color="textSecondary" style={{ padding: '16px' }}>
          No nearby roads found
        </Typography>
      )}

    </div>
  );
};

export default NewPage;
