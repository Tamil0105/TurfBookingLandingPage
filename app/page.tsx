"use client";


import HeroCarousel from '@/components/sections/HeroCarousel';
import Features from '@/components/sections/Features';
import Testimonials from '@/components/sections/Testimonials';
import Footer from '@/components/sections/Footer';
import Header from '@/components/sections/Header';
import AboutUs from '@/components/sections/About';
import { BlurFadeDemo } from '@/components/MagicUiImageGallery/main';
import SliderSectionForTurfCard from '@/components/sliderForTurfCard/main';
import TurfImageGallery from '@/components/sections/TurfGallery';

export default function Home() {
  return (
    <main className="relative">
      <Header />
      <HeroCarousel />
      <AboutUs/>
      <Features />
      <BlurFadeDemo/>
      {/* <SliderSectionForTurfCard/> */}
      <TurfImageGallery/>
      {/* <BookingSection /> */}
      <Testimonials />
      <Footer />
   
    </main>
  );
}