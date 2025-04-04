"use client";
import Image from "next/image";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

const Banner = () => {
  const [quizId, setQuizId] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleQuizAccess = (e: FormEvent) => {
    e.preventDefault();
    if (!quizId.trim()) {
      setError("Please enter a quiz ID");
      return;
    }

    // Clear any previous errors
    setError("");

    // Navigate to the quiz page with the quiz ID
    router.push(`/quiz/${quizId}`);
  };

  return (
    <div id="home" className="bg-lightkblue">
      <div className="mx-auto max-w-7xl pt-20 sm:pb-24 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 space-x-1">
          <div className="col-span-6 flex flex-col justify-evenly">
            <h1 className="text-midnightblue text-4xl sm:text-5xl font-semibold text-center lg:text-start lh-120 pt-5 lg:pt-0">
              Engage Your Audience with Interactive Real-time Quizzes.
            </h1>
            <h3 className="text-charcoal text-lg font-normal text-center lg:text-start opacity-75 pt-5 lg:pt-0">
              Perfect for classrooms, meetings, and events. Create, share, and
              analyze responses effortlessly to make learning and discussions
              more dynamic!
            </h3>

            {/* Quiz Access Form */}
            <div className="mt-8 mb-4">
              <form
                onSubmit={handleQuizAccess}
                className="flex flex-col sm:flex-row gap-2"
              >
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Enter Quiz ID"
                    value={quizId}
                    onChange={(e) => setQuizId(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-grey500 focus:outline-none focus:ring-2 focus:ring-Blueviolet"
                    aria-label="Quiz ID"
                  />
                  {error && <p className="text-red text-sm mt-1">{error}</p>}
                </div>
                <div className="ml-4">
                  <button
                    type="button"
                    onClick={() => (window.location.href = "/quiz")}
                    className="rounded-full bg-semiblueviolet px-6 py-4 text-sm font-medium text-Blueviolet hover:bg-Blueviolet hover:text-white transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-Blueviolet focus-visible:ring-opacity-75"
                  >
                    Go to Quiz
                  </button>
                </div>
              </form>
            </div>

            <div className="flex items-center justify-between pt-4 lg:pt-4">
              <div className="flex gap-2">
                <Image
                  src="/assets/banner/check-circle.svg"
                  alt="check-image"
                  width={30}
                  height={30}
                  className="smallImage"
                />
                <p className="text-sm sm:text-lg font-normal text-black">
                  Flexible
                </p>
              </div>
              <div className="flex gap-2">
                <Image
                  src="/assets/banner/check-circle.svg"
                  alt="check-image"
                  width={30}
                  height={30}
                  className="smallImage"
                />
                <p className="text-sm sm:text-lg font-normal text-black">
                  Customizable
                </p>
              </div>
              <div className="flex gap-2">
                <Image
                  src="/assets/banner/check-circle.svg"
                  alt="check-image"
                  width={30}
                  height={30}
                  className="smallImage"
                />
                <p className="text-sm sm:text-lg font-normal text-black">
                  Interactive
                </p>
              </div>
            </div>
          </div>

          <div className="col-span-6 flex justify-center">
            <Image
              src="/assets/banner/mahila.png"
              alt="quiz illustration"
              width={1000}
              height={805}
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
