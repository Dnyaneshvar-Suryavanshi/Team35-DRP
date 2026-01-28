import React from 'react'
import { Navbar } from '../components/Navbar'
import Carousel from '../components/Curouser'
import Notices from '../components/Instructions'
import Footer from '../components/Footer'

export const LandingPage = () => {
    return (
        <div>
            <Navbar />
            <Carousel />
            <Notices />
            <Footer />
        </div>
    )
}
