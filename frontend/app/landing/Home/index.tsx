import BaseLayout from "./baselayout";

export default function Home() {
  return (
    <BaseLayout>
      <div className="flex h-screen bg-lightkblue">
        {/* Main Content */}
        <div className="flex-1 p-5 bg-white rounded-xl m-2.5 shadow-lg">
          {/* App Info Section */}
          <div className="flex items-center mb-8 bg-gradient-to-r from-midnightblue to-ultramarine p-5 rounded-xl text-white">
            <div className="app-details">
              <h1 className="text-3xl mb-2.5">
                Welcome to <span className="text-gold font-bold">Q-Code</span>
              </h1>
              <p className="text-base leading-relaxed text-grey500">
                Q-Code makes quiz creation effortless and enjoyable! Build
                engaging quizzes for education, teambuilding, and fun. Get
                started today and unleash your creativity.
              </p>
            </div>
          </div>

          {/* Header Section */}
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-bold">My Events</h2>
            <div>
              <button className="ml-2.5 px-5 py-2.5 bg-gradient-to-r from-Blueviolet to-ultramarine text-white border-none rounded-lg cursor-pointer font-bold hover:bg-gradient-to-r hover:from-cornflowerblue hover:to-Blueviolet hover:scale-105 transition-all duration-300">
                + Create Event
              </button>
              <button className="ml-2.5 px-5 py-2.5 bg-gradient-to-r from-Blueviolet to-ultramarine text-white border-none rounded-lg cursor-pointer font-bold hover:bg-gradient-to-r hover:from-cornflowerblue hover:to-Blueviolet hover:scale-105 transition-all duration-300">
                Import Event
              </button>
            </div>
          </div>

          {/* Search and Sort Section */}
          <div className="flex justify-between items-center mb-5">
            <input
              type="text"
              placeholder="Search..."
              className="p-2.5 w-1/2 border-2 border-midnightblue rounded-lg outline-none focus:border-Blueviolet focus:shadow-md"
            />
            <select className="p-2.5 border-2 border-Blueviolet rounded-lg outline-none bg-white focus:border-cornflowerblue focus:shadow-md">
              <option value="most-recent">Most Recent</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>

          {/* Event List Section */}
          <div className="border-t-2 border-midnightblue mt-5 pt-2.5">
            <div className="flex justify-between py-2.5 border-b border-grey500">
              <div className="font-bold text-charcoal">
                Questions for teambuilding (copy)
              </div>
              <div className="text-ultramarine font-bold">12 Jan 2025</div>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
