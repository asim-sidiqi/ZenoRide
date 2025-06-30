
import React, { useContext } from 'react'
import { CaptainDataContext } from '../context/CaptainContext'

const CaptainDetails = () => {

    const { captain } = useContext(CaptainDataContext)
    console.log("Captain in CaptainDetails.jsx:", captain);

    if (!captain || !captain.fullname) return <p>Loading captain details...</p>;

    return (
        <div>
            <div className='flex items-center justify-between'>
                <div className='flex items-center justify-start gap-3'>
                    <img className='h-10 w-10 rounded-full object-cover' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdlMd7stpWUCmjpfRjUsQ72xSWikidbgaI1w&s" alt="" />
                    <h4 className='text-lg font-medium capitalize'>{captain.fullname.firstname + " " + captain.fullname.lastname}</h4>
                </div>
                <div>
                    <h4 className='text-xl font-semibold'>₹0</h4>
                    <p className='text-sm text-gray-600'>Earned</p>
                </div>
            </div>
            <div className='flex p-3 mt-8 bg-gray-100 rounded-xl justify-center gap-5 items-start'>
                <div className='text-center'>
                    <i className="text-3xl mb-2 font-thin ri-timer-2-line"></i>
                    <h5 className='text-lg font-medium'>0</h5>
                    <p className='text-sm text-gray-600'>Hours Online</p>
                </div>
                <div className='text-center'>
                    <i className="text-3xl mb-2 font-thin ri-car-line"></i>
                    <h5 className='text-lg font-medium'>0</h5>
                    <p className='text-sm text-gray-600'>Rides Completed</p>
                </div>
                <div className='text-center ml-3'>
                    <i className="text-3xl mb-2 font-thin ri-star-line"></i>
                    <h5 className='text-lg font-medium'>0</h5>
                    <p className='text-sm text-gray-600'>Ratings</p>
                </div>

            </div>
        </div>
    )
}

export default CaptainDetails