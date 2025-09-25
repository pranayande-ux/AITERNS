import { ProgressTracker } from "@/components/Dashboard/ProgressTracker";

const Home = () => {
  return (
    <div className="min-h-screen">

      {/* Dashboard Section */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold font-poppins mb-4">
                  <span className="bg-gradient-primary bg-clip-text text-transparent">
                    Your Career
                  </span>{" "}
                  <span className="text-foreground">Progress</span>
                </h2>
                <p className="text-xl text-muted-foreground">
                  Track your journey to career success
                </p>
              </div>
            </div>
            <div className="lg:col-span-1">
              <ProgressTracker />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;