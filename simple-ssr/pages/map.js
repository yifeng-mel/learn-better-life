import React, { useState } from "react";

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
    console.log(Date.now())
    for (let i = 0; i < 500; i++) {
        console.log(getDistanceFromLatLonInKm(-37.89731737440222, 145.1124408023911, -37.89830368733838, 145.11572382632474))
    }
    console.log(Date.now())
    return <h1>First Post</h1>;
}