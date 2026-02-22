import React from 'react'
import ItemsNearby from '../components/UI/ItemsNearby';
import HowItWorks from '../components/UI/HowItWork';
import HeroSection from '../components/UI/HeroSection';
import BrowseCategory from '../components/UI/BrowseCategory';


const Browse = () => {
  return (
    <main className="min-h-screen bg-[#fafafa]">

     
      <HeroSection />

      {/* Wrapping the rest in a container to keep it 
        aligned with the Header and Hero width 
      */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-12 py-10">
        
        <section>
          <BrowseCategory />
        </section>

        <section>
          <ItemsNearby />
        </section>

        <section className="pb-20">
          <HowItWorks />
        </section>
        
      </div>
    </main>
  )
}

export default Browse;