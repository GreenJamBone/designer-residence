import Hero from '@/components/Hero'
import CurrentlyInResidence from '@/components/CurrentlyInResidence'
import UpcomingEvents from '@/components/UpcomingEvents'
import JoinTheList from '@/components/JoinTheList'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="flex flex-col">
      <Hero />
      <CurrentlyInResidence />
      <UpcomingEvents />
      <JoinTheList />
      <Footer />
    </main>
  )
}
