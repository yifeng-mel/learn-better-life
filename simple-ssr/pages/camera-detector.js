import React, { useState, useEffect } from "react";
import cameras from "../src/utils/cameras";

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
                    return distance < 1
                })

                setFoundIndex(foundIndex)
                setDistance(camera_distance)
            })();
        }, 2000);

        (async () => {
            const wakeLock = await navigator.wakeLock.request('screen');
        })()

        return () => {
            clearInterval(interval)
            // this now gets called when the component unmounts
        };
    }, []);

    return (
        <div style={{ background: foundIndex > -1 ? 'red' : 'green', height: "100vh" }}>
            <h1>
                {distance ? distance.toFixed(2) + ' km' : ''}
            </h1>
            <h1>
                {foundIndex > -1 ? cameras[foundIndex].location : ''}
            </h1>
            <h2>
                {foundIndex > -1 ? cameras[foundIndex].lat + ',' + cameras[foundIndex].lon : ''}
            </h2>
        </div>
    );
}