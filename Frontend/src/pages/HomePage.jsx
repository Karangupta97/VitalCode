import AgentGuardSection from '../components/landing/AgentGuardSection'
import CTASection from '../components/landing/CTASection'
import FeaturesSection from '../components/landing/FeaturesSection'
import Footer from '../components/landing/Footer'
import Hero from '../components/landing/Hero'
import HowItWorksSection from '../components/landing/HowItWorksSection'
import Navbar from '../components/landing/Navbar'
import ProblemSection from '../components/landing/ProblemSection'
import SolutionSection from '../components/landing/SolutionSection'
import UseCasesSection from '../components/landing/UseCasesSection'

const HomePage = () => {
  return (
    <div className='min-h-screen bg-(--ms-bg)'>
      <div className='pointer-events-none fixed inset-0 -z-10'>
        <div className='absolute left-[-18rem] top-[-10rem] h-[32rem] w-[32rem] rounded-full bg-emerald-300/35 blur-3xl' />
        <div className='absolute right-[-16rem] top-20 h-[30rem] w-[30rem] rounded-full bg-sky-300/35 blur-3xl' />
        <div className='absolute bottom-[-12rem] left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-cyan-200/35 blur-3xl' />
      </div>

      <Navbar />
      <main>
        <Hero />
        <ProblemSection />
        <SolutionSection />
        <FeaturesSection />
        <AgentGuardSection />
        <HowItWorksSection />
        <UseCasesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}

export default HomePage
