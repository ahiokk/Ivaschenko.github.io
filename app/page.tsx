import LoadingExperience from "@/components/loading-experience";
import StorytellingExperience from "@/components/storytelling-experience";
import TopNavigation from "@/components/top-navigation";

export default function HomePage() {
  return (
    <>
      <LoadingExperience />
      <TopNavigation />
      <main className="relative min-h-screen">
        <StorytellingExperience />
      </main>
    </>
  );
}
