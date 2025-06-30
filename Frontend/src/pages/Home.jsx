import React, { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import axios from 'axios';
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../components/LocationSearchPanel';
import VehiclePanel from '../components/VehiclePanel';
import ConfirmRide from '../components/ConfirmRide';
import LookingForDriver from '../components/LookingForDriver';
import WaitingForDriver from '../components/WaitingForDriver';
import { SocketContext } from '../context/SocketContext';
import { useContext } from 'react';
import { UserDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import LiveTracking from '../components/LiveTracking';
import OnSight from '../components/OnSight';
import logo from '../assets/logo.png'; 

const Home = () => {
    const [ pickup, setPickup ] = useState('')
    const [ destination, setDestination ] = useState('')
    const [ panelOpen, setPanelOpen ] = useState(false)
    const vehiclePanelRef = useRef(null)
    const confirmRidePanelRef = useRef(null)
    const vehicleFoundRef = useRef(null)
    const onSightPanelRef = useRef(null);
    const waitingForDriverRef = useRef(null)
    const panelRef = useRef(null)
    const panelCloseRef = useRef(null)
    const [ vehiclePanel, setVehiclePanel ] = useState(false)
    const [ confirmRidePanel, setConfirmRidePanel ] = useState(false) //testing phase
    const [ vehicleFound, setVehicleFound ] = useState(false)
    const [ onSightPanel, setOnSightPanel ] = useState(false) //testing phase
    const [ waitingForDriver, setWaitingForDriver ] = useState(false)
    const [ pickupSuggestions, setPickupSuggestions ] = useState([])
    const [ destinationSuggestions, setDestinationSuggestions ] = useState([])
    const [ activeField, setActiveField ] = useState(null)
    const [ fare, setFare ] = useState({})
    const [ vehicleType, setVehicleType ] = useState(null)
    const [ ride, setRide ] = useState(null)
    const [plateNumber, setPlateNumber] = useState('');

    const navigate = useNavigate()

    const { socket } = useContext(SocketContext)
    const { user } = useContext(UserDataContext)

    useEffect(() => {
        socket.emit("join", { userType: "user", userId: user._id })
    }, [ user ])

    useEffect(() => {
        socket.on('ride-confirmed', ride => {
            setVehicleFound(false);
            setWaitingForDriver(true);
            setRide(ride);
        });

        socket.on('ride-on-sight', ride => {
            setVehicleFound(false);
            setWaitingForDriver(true);
            setRide(ride);
        });

        socket.on('ride-started', ride => {
            console.log(ride);
            setWaitingForDriver(false);
            navigate('/riding', { state: { ride } });
        });

        return () => {
            socket.off('ride-confirmed');
            socket.off('ride-on-sight');
            socket.off('ride-started');
        };
    }, [socket]);



    const handlePickupChange = async (e) => {
        setPickup(e.target.value)
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                params: { input: e.target.value },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }

            })
            setPickupSuggestions(response.data)
        } catch {
            console.error("Error fetching pickup suggestions:", e);
        }
    }

    const handleDestinationChange = async (e) => {
        setDestination(e.target.value)
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                params: { input: e.target.value },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            setDestinationSuggestions(response.data)
        } catch {
            // handle error
        }
    }

    const submitHandler = (e) => {
        e.preventDefault()
    }

    useGSAP(function () {
        if (panelOpen) {
            gsap.to(panelRef.current, {
                height: '70%',
                padding: 24
                // opacity:1
            })
            gsap.to(panelCloseRef.current, {
                opacity: 1
            })
        } else {
            gsap.to(panelRef.current, {
                height: '0%',
                padding: 0
                // opacity:0
            })
            gsap.to(panelCloseRef.current, {
                opacity: 0
            })
        }
    }, [ panelOpen ])


    useGSAP(function () {
        if (!vehiclePanelRef.current) return;

        if (vehiclePanel) {
            gsap.to(vehiclePanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(vehiclePanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ vehiclePanel ])

    useGSAP(function () {
        if (confirmRidePanelRef.current) {
            if (confirmRidePanel) {
                gsap.to(confirmRidePanelRef.current, {
                    transform: 'translateY(0)'
                })
            } else {
                gsap.to(confirmRidePanelRef.current, {
                    transform: 'translateY(100%)'
                })
            }
        }
    }, [ confirmRidePanel ])

    useGSAP(function () {
        if (vehicleFoundRef.current) {
            if (vehicleFound) {
                gsap.to(vehicleFoundRef.current, {
                    transform: 'translateY(0)'
                })
            } else {
                gsap.to(vehicleFoundRef.current, {
                    transform: 'translateY(100%)'
                })
            }
        }
    }, [ vehicleFound ])

    useGSAP(function () {
        if (onSightPanelRef.current) {
            if (onSightPanel) {
                gsap.to(onSightPanelRef.current, {
                    transform: 'translateY(0)'
                })
            } else {
                gsap.to(onSightPanelRef.current, {
                    transform: 'translateY(100%)'
                })
            }
        }
    }, [ onSightPanel ])



    useGSAP(function () {
        if (waitingForDriver) {
            gsap.to(waitingForDriverRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(waitingForDriverRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ waitingForDriver ])


    async function findTrip() {
        setVehiclePanel(true)
        setPanelOpen(false)

        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare`, {
            params: { pickup, destination },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });


        setFare(response.data)
    }

    async function createRide() {
        const token = localStorage.getItem('token');

        if (!token) {
            console.error('No auth token found! pakda gaya');
            return;
        }

        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/create`, {
            pickup,
            destination,
            vehicleType
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log(response.data);
    }

    async function createOnSightRide(plateNumber) {
        const token = localStorage.getItem('token');

        if (!token) {
            console.error('No auth token found!');
            return;
        }

        // Debug: log the values being sent
        console.log({ pickup, destination, vehicleType, plateNumber });

        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/on-sight`, {
                pickup,
                destination,
                vehicleType,
                plateNumber
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log(response.data);
        } catch (error) {
            alert(error.response?.data?.message || "Failed to book ride. Please check your input.");
            console.error(error);
        }
    } 

    return (
        <div className='h-screen relative overflow-hidden'>
            
            <div className='h-screen w-screen'>
                {/* <img className='w-16 absolute left-5 top-5 z-10 mt-10' src={logo} alt="" /> */}
                <LiveTracking />
            </div>
            <div className=' flex flex-col justify-end h-screen absolute top-0 w-full'>
                <div className='h-[30%] p-6 bg-white relative'>
                    <h5 ref={panelCloseRef} onClick={() => {
                        setPanelOpen(false)
                    }} className='absolute opacity-0 right-6 top-6 text-2xl'>
                        <i className="ri-arrow-down-wide-line"></i>
                    </h5>
                    <h4 className='text-2xl font-semibold'>Find a trip</h4>
                    <form className='relative py-3' onSubmit={(e) => {
                        submitHandler(e)
                    }}>
                        <div className="line absolute h-16 w-1 top-[50%] -translate-y-1/2 left-5 bg-gray-700 rounded-full"></div>
                        <input
                            onClick={() => {
                                setPanelOpen(true)
                                setActiveField('pickup')
                            }}
                            value={pickup}
                            onChange={handlePickupChange}
                            className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full'
                            type="text"
                            placeholder='Add a pick-up location'
                        />
                        <input
                            onClick={() => {
                                setPanelOpen(true)
                                setActiveField('destination')
                            }}
                            value={destination}
                            onChange={handleDestinationChange}
                            className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full  mt-3'
                            type="text"
                            placeholder='Enter your destination' />
                    </form>
                    <button
                        onClick={findTrip}
                        className='bg-black text-white px-4 py-2 rounded-lg mt-3 w-full'>
                        Find Trip
                    </button>
                </div>
                <div ref={panelRef} className='bg-white h-0'>
                    <LocationSearchPanel
                        suggestions={activeField === 'pickup' ? pickupSuggestions : destinationSuggestions}
                        setPanelOpen={setPanelOpen}
                        setVehiclePanel={setVehiclePanel}
                        setPickup={setPickup}
                        setDestination={setDestination}
                        activeField={activeField}
                    />
                </div>
            </div>

            {vehiclePanel && (
            <div ref={vehiclePanelRef} className='fixed w-full z-10 bottom-10 translate-y-full bg-white px-3 py-10 pt-12'>
                <VehiclePanel
                    selectVehicle={setVehicleType}
                    fare={fare} setConfirmRidePanel={setConfirmRidePanel} setVehiclePanel={setVehiclePanel} />
            </div>
            )}

            {confirmRidePanel && (
            <div ref={confirmRidePanelRef} className='fixed w-full z-30 bottom-0 bg-white px-3 py-6 pt-12 max-h-[80vh] overflow-y-auto' style={{ transform: 'translateY(0)' }}>
                <ConfirmRide
                    createRide={createRide}
                    pickup={pickup}
                    destination={destination}
                    fare={fare}
                    vehicleType={vehicleType}
                    setConfirmRidePanel={setConfirmRidePanel}
                    setOnSightPanel={setOnSightPanel}
                    setVehicleFound={setVehicleFound}/>
            </div>
            )
            }

            {vehicleFound && (
            <div ref={vehicleFoundRef} className='fixed w-full z-40 bottom-0 bg-white px-3 py-6 pt-12 max-h-[80vh] overflow-y-auto' style={{ transform: 'translateY(0)' }}>
                <LookingForDriver
                    createRide={createRide}
                    pickup={pickup}
                    destination={destination}
                    fare={fare}
                    vehicleType={vehicleType}
                    setVehicleFound={setVehicleFound}/>
             </div>
            )}

            {onSightPanel && (
            <div ref={onSightPanelRef} className='fixed w-full z-40 bottom-0 bg-white px-3 py-6 pt-12 max-h-[80vh] overflow-y-auto' style={{ transform: 'translateY(0)' }}>
                <OnSight
                    createOnSightRide={createOnSightRide}
                    pickup={pickup}
                    destination={destination}
                    fare={fare}
                    vehicleType={vehicleType}
                    setVehicleFound={setVehicleFound}
                    plateNumber={plateNumber}
                    setPlateNumber={setPlateNumber}
                    setOnSightPanel={setOnSightPanel}
                    setVehiclePanel={setVehiclePanel}/>
             </div>
            )}

            <div ref={waitingForDriverRef} className='fixed w-full  z-10 bottom-0  bg-white px-3 py-6 pt-12'>
                <WaitingForDriver
                    ride={ride}
                    setVehicleFound={setVehicleFound}
                    setWaitingForDriver={setWaitingForDriver}
                    waitingForDriver={waitingForDriver} />
            </div>
        </div>
    )
}

export default Home