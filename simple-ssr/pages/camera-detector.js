import React, { useState, useEffect } from "react";
import cameras from "../src/utils/cameras";
import NoSleep from "nosleep.js";
import { Typography, Divider, Card, CardContent, Grid } from "@mui/material";
import Head from 'next/head'
import { Box } from "@mui/system";
import Script from 'next/script';

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

export default function FirstPost() {
    const [foundIndex, setFoundIndex] = useState();
    const [distance, setDistance] = useState();
    // 🆗 Ship it
    useEffect(() => {
        const interval = setInterval(() => {
            (async () => {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject);
                });
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                let camera_distance = 0;

                const foundIndex = cameras.findIndex((camera) => {
                    const lat = parseFloat(camera.lat)
                    const lon = parseFloat(camera.lon)
                    const distance = getDistanceFromLatLonInKm(latitude, longitude, lat, lon)
                    camera_distance = distance
                    return distance < 0.5
                })

                setFoundIndex(foundIndex)
                setDistance(camera_distance)
            })();
        }, 2000);

        let isEnableNoSleep = false;
        const noSleep = new NoSleep();
        document.addEventListener(
            `click`,
            function enableNoSleep() {
                document.removeEventListener(`click`, enableNoSleep, false);
                noSleep.enable();
                isEnableNoSleep = true;
                alert(`Your screen will keep on`);
                document.getElementById("banner").remove();
            },
            false
        );

        return () => {
            clearInterval(interval)
        };
    }, []);

    return (
        <div style={{ background: foundIndex > -1 ? 'red' : 'green', height: "100vh" }}>
            <Head>
                <title>Victoria Camera Detector</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <meta name="description" content="This app helps you detect fixed road safety camera within 500 meters in Victoria, Australia." />
            </Head>
            <Script strategy="lazyOnload" src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`} />

            <Script strategy="lazyOnload">
                {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
                page_path: window.location.pathname,
                });
                `}
            </Script>
            <Typography variant="h5" align="center">
                {foundIndex == -1 || !distance ? 'No camera detected within 500 meters' : ''}
            </Typography>
            <Typography variant="h5" align="center">
                {foundIndex > -1 && distance ? 'Nearest Camera: ' : ''}
            </Typography>
            <Typography variant="h2" align="center">
                {foundIndex > -1 && distance ? distance.toFixed(2) + ' km' : ''}
            </Typography>
            <Divider />
            <Box sx={{ p: 2 }}>
                <Typography variant="h5" align="center">
                    {foundIndex > -1 && distance ? 'Camera Location: ' : ''}
                </Typography>
                <Typography variant="body1" align="center">
                    {foundIndex > -1 ? cameras[foundIndex].location : ''}
                </Typography>
            </Box>

            <Box sx={{ pb: 2 }}>
                <Typography variant="h5" align="center">
                    {foundIndex > -1 && distance ? 'Camera Coordinate: ' : ''}
                </Typography>
                <Typography variant="body1" align="center">
                    {foundIndex > -1 ? cameras[foundIndex].lat + ',' + cameras[foundIndex].lon : ''}
                </Typography>
            </Box>

            <div id="banner"><Typography align="center">Click Screen to Keep Screen on</Typography></div>
            <br></br>
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justify="center"
                style={{ minHeight: '100vh' }}
            >
                <Card style={{ maxWidth: '300px' }}>
                    <CardContent>
                        <Typography variant="body1" component="div" sx={{ flexGrow: 1 }}>
                            This app helps you detect fixed road safety camera within 500 meters in Victoria, Australia. Please enable your broswer to access your location to use this app.
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        </div>
    );
}