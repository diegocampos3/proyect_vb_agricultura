import { Fragment, useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Swal from "sweetalert2";
import L from 'leaflet';
import axios from 'axios';
import clienteAxios from "../../config/axios";
import { useCropContext } from '../../context/CropContext';

// Set default Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function Cultivo() {
    const { setCropData } = useCropContext();

    const [crop, saveCrop] = useState({
        crop: '',
        cultivationA: '',
        agriculturalP: '',
        lat: '',
        lng: '',
        predictionYear: '',
        predictionMonth: ''
    });

    // Read form data
    const updateCrop = e => {
        saveCrop({
            ...crop,
            [e.target.name]: e.target.value
        });
    }

    const addCrop = e => {
        e.preventDefault();

        const cropData = {
            ...crop,
            lat: position[0],
            lng: position[1],
        };

        setCropData(cropData);

        clienteAxios.post('/register', cropData)
            .then(res => {
                if (res.data.code === 11000) {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Could not obtain information."
                    });
                } else {
                    Swal.fire({
                        title: "The results are ready, you can visit them.",
                        text: res.data.message,
                        icon: "success"
                    });
                }
            })
            .catch(error => {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "There was a problem registering the data.",
                });
                console.error("Error sending data:", error);
            });
    }

    const [position, setPosition] = useState(() => {
        const savedPosition = localStorage.getItem('position');
        return savedPosition ? JSON.parse(savedPosition) : [0, 0];
    });
    const [locationName, setLocationName] = useState("");

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setPosition([latitude, longitude]);
                    fetchLocationName(latitude, longitude);
                    localStorage.setItem('position', JSON.stringify([latitude, longitude]));
                },
                () => {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Could not obtain your location."
                    });
                }
            );
        } else {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Geolocation is not supported by this browser."
            });
        }
    }, []);

    const fetchLocationName = async (lat, lng) => {
        try {
            const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
            setLocationName(response.data.display_name || "Unknown location");
        } catch (error) {
            console.error("Error obtaining location name:", error);
        }
    };

    const LocationMarker = () => {
        useMapEvents({
            click(e) {
                const newPosition = [e.latlng.lat, e.latlng.lng];
                setPosition(newPosition);
                fetchLocationName(e.latlng.lat, e.latlng.lng);
                localStorage.setItem('position', JSON.stringify(newPosition));
            },
        });

        return position === null ? null : (
            <Marker
                position={position}
                draggable={true}
                eventHandlers={{
                    dragend: (e) => {
                        const marker = e.target;
                        const newPos = marker.getLatLng();
                        setPosition([newPos.lat, newPos.lng]);
                        fetchLocationName(newPos.lat, newPos.lng);
                        localStorage.setItem('position', JSON.stringify([newPos.lat, newPos.lng]));
                    },
                }}
            />
        );
    };
    
    const resetForm = () => {
        saveCrop({
            crop: '',
            cultivationA: '',
            agriculturalP: '',
            lat: '',
            lng: '',
            predictionYear: '',
            predictionMonth: ''
        });
    };

    return (
        <Fragment>
            <div className="cultivo-container">
                <h2 className="form-title">Register your crop</h2>
                <form className="formulario" onSubmit={addCrop}>
                    <legend className="form-legend">Fill in all fields</legend>
                    <div className="campo">
                        <label>Crop:</label>
                        <input 
                            type="text" 
                            placeholder="Type of Crop" 
                            name="crop" 
                            className="input-field" 
                            value={crop.crop} 
                            onChange={updateCrop} 
                            required // Added required attribute
                        />
                    </div>
                    <div className="campo">
                        <label>Cultivation Area:</label>
                        <select 
                            name="cultivationA" 
                            className="input-field" 
                            value={crop.cultivationA} 
                            onChange={updateCrop}
                            required // Added required attribute
                        >
                            <option value="">Select an Area</option>
                            <option value="small">Small (0.5 - 2 hectares)</option>
                            <option value="medium">Medium (2 - 10 hectares)</option>
                            <option value="large">Large (10+ hectares)</option>
                        </select>
                    </div>
                    <div className="campo">
                        <label>Agricultural Practices:</label>
                        <select 
                            name="agriculturalP" 
                            className="input-field" 
                            value={crop.agriculturalP} 
                            onChange={updateCrop}
                            required // Added required attribute
                        >
                            <option value="">Select a Practice</option>
                            <option value="irrigation">Irrigation</option>
                            <option value="organic">Organic Farming</option>
                            <option value="fertilizer">Fertilizer Use</option>
                            <option value="crop_rotation">Crop Rotation</option>
                        </select>
                    </div>

                    {/* New selectors for prediction year and month */}
                    <div className="campo">
                        <label>Prediction Year:</label>
                        <select 
                            name="predictionYear" 
                            className="input-field" 
                            value={crop.predictionYear} 
                            onChange={updateCrop}
                            required // Added required attribute
                        >
                            <option value="">Select a Year</option>
                            {Array.from({ length: 10 }, (v, i) => new Date().getFullYear() + i).map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                    <div className="campo">
                        <label>Prediction Month:</label>
                        <select 
                            name="predictionMonth" 
                            className="input-field" 
                            value={crop.predictionMonth} 
                            onChange={updateCrop}
                            required // Added required attribute
                        >
                            <option value="">Select a Month</option>
                            {Array.from({ length: 12 }, (v, i) => i + 1).map(month => (
                                <option key={month} value={month}>{month}</option>
                            ))}
                        </select>
                    </div>

                    <h1>Select Location</h1>
                    <div className="campo">
                        <MapContainer center={position} zoom={13} style={{ height: "500px", width: "100%" }} scrollWheelZoom={true}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <LocationMarker />
                        </MapContainer>
                    </div>

                    <div className="campo location-display">
                        <h3 className="location-title">Current Location:</h3>
                        <p className="location-name">{locationName}</p>
                    </div>

                    <div className="enviar">
                        <div className="button-container">
                            <div className="eliminar">
                                <button
                                    type="button"
                                    className="btn btn-rojo"
                                    onClick={resetForm}
                                >
                                    Delete Data
                                </button>
                            </div>
                            <input
                                type="submit"
                                className="btn btn-verde"
                                value="Analyze"
                            />
                        </div>
                    </div>
                </form>
            </div>
        </Fragment>
    );
}

export default Cultivo;
