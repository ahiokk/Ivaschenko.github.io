import ContactSection from "@/components/contact-section";
import HeroSection from "@/components/hero-section";
import LoadingExperience from "@/components/loading-experience";
import StorytellingExperience from "@/components/storytelling-experience";
import TopNavigation from "@/components/top-navigation";

export default function HomePage() {
  return (
    <>
      <LoadingExperience />
      <TopNavigation />
      <main className="relative mx-auto w-[min(1680px,99vw)] pb-24 pt-24 lg:pt-28">
        <HeroSection />
        <StorytellingExperience />
        <ContactSection />
      </main>
    </>
  );
}
