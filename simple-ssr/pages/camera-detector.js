import React, { useState, useEffect } from "react";

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
    const [latitude, setLatitude] = useState();
    const [longitude, setLongtitude] = useState();

    // 🆗 Ship it
    useEffect(() => {
        (async () => {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });
            let latitude = position.coords.latitude;
            let longitude = position.coords.longitude;

            setLatitude(latitude)
            setLongtitude(longitude)
        })();

        return () => {
            // this now gets called when the component unmounts
        };
    }, []);

    return <h1>Latitude: {latitude} <br /> Longitude: {longitude}</h1>;
}