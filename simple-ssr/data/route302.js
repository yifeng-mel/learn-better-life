// data/route302.js

export const routeInfo = {
    routeId: "17-302-aus-1.2.R",
    routeShortName: "302",
    routeLongName: "Box Hill Station - City (King/Lonsdale St)"
}

// ===== Stops =====
export const stops = [
    {
        stop_id: 19648,
        stop_name: "Box Hill Bus Station/Station St",
        stop_lat: -37.8198278,
        stop_lon: 145.12214065
    },
    {
        stop_id: 19549,
        stop_name: "King St/Lonsdale St",
        stop_lat: -37.81428813,
        stop_lon: 144.95512439
    },
    {
        stop_id: 4950,
        stop_name: "Balwyn Rd/Belmore Rd",
        stop_lat: -37.80356307,
        stop_lon: 145.08254956
    },
    {
        stop_id: 19246,
        stop_name: "East Kew Terminus/Valerie St",
        stop_lat: -37.79926155,
        stop_lon: 145.04945191
    },
    {
        stop_id: 50836,
        stop_name: "St Vincent's Hospital/Victoria Pde",
        stop_lat: -37.8078371,
        stop_lon: 144.97502071
    },
    {
        stop_id: 19554,
        stop_name: "Swanston St/Lonsdale St",
        stop_lat: -37.81130998,
        stop_lon: 144.96528201
    }
]

// ===== LineString =====
export const lineString = {
    type: "LineString",
    coordinates: [
        [145.12206727, -37.81982257],
        [145.12146836, -37.81799828],
        [145.1198392, -37.81460333],
        [145.11705286, -37.80582171],
        [145.11381343, -37.80055833],
        [145.10433158, -37.80204834],
        [145.09321129, -37.80452833],
        [145.08025469, -37.80310617],
        [145.06568641, -37.80119941],
        [145.04738115, -37.79841968],
        [145.02914676, -37.7920049],
        [145.01892076, -37.79124819],
        [145.01012769, -37.79261458],
        [145.00226452, -37.79524124],
        [144.99336405, -37.79842061],
        [144.98972211, -37.80991191],
        [144.97870495, -37.80869119],
        [144.96586525, -37.81128266],
        [144.95544957, -37.81429369]
    ]
}

export const testBuses = [
    { id: '6522AO', lat: -37.78998, lng: 145.02666, bearing: 133 },
    { id: 'BS05CA', lat: -37.81815, lng: 145.12384, bearing: 215 },
    { id: 'BS05DI', lat: -37.814877, lng: 144.95326, bearing: 209 },
    { id: 'BS05AT', lat: -37.81862, lng: 145.12776, bearing: 273 },
    { id: 'BS05BL', lat: -37.788464, lng: 145.19885, bearing: 194 },
    { id: 'BS05AV', lat: -37.800835, lng: 145.06287, bearing: 279 },
    { id: 'BS03LO', lat: -37.810528, lng: 144.95634, bearing: 79 },
]