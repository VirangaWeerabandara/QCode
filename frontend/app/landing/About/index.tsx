import Image from "next/image";

const About = () => {
  const features = [
    {
      title: "Real-time Interaction",
      description:
        "Create interactive quizzes that engage participants with immediate responses and feedback.",
      icon: "/assets/about/realtime-icon.png",
    },
    {
      title: "Analytics Dashboard",
      description:
        "Gain insights through comprehensive analytics and visualizations of participant responses.",
      icon: "/assets/about/analytics-icon.png",
    },
    {
      title: "Multiple Question Formats",
      description:
        "Choose from various question types including multiple choice, polls, and free-text responses.",
      icon: "/assets/about/question-icon.png",
    },
    {
      title: "Easy Integration",
      description:
        "Seamlessly integrate with presentation tools, LMS platforms, and video conferencing systems.",
      icon: "/assets/about/integration-icon.png",
    },
  ];

  return (
    <section id="about" className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-midnightblue mb-4">
            About QCode
          </h2>
          <p className="text-charcoal text-lg max-w-3xl mx-auto">
            QCode is an innovative platform designed to make live quizzes and
            polls more engaging and accessible for everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* About image */}
          <div className="flex items-center justify-center">
            <Image
              src="/assets/about/about-illustration.png" // Add this image to your assets folder
              alt="QCode platform illustration"
              width={500}
              height={400}
              className="rounded-lg shadow-lg"
            />
          </div>

          {/* About content */}
          <div className="flex flex-col justify-center">
            <h3 className="text-2xl font-semibold text-midnightblue mb-6">
              Transforming interaction through real-time engagement
            </h3>
            <p className="text-charcoal mb-8">
              Our platform empowers educators, presenters, and event organizers
              to create interactive experiences that captivate audiences, gather
              valuable feedback, and make learning more effective through active
              participation.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex flex-col">
                  <div className="flex items-center mb-3">
                    <div className="bg-semiblueviolet p-2 rounded-full mr-3">
                      <Image
                        src={feature.icon}
                        alt={feature.title}
                        width={24}
                        height={24}
                      />
                    </div>
                    <h4 className="font-medium text-midnightblue">
                      {feature.title}
                    </h4>
                  </div>
                  <p className="text-sm text-charcoal pl-12">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
