
// 'use client';

// import { useState, useEffect } from "react";
// import BaseLayout from "./baselayout";
// import Sidebar from "./sidebar";

// export default function Home() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [sortOption, setSortOption] = useState("most-recent");
//   const [events, setEvents] = useState([
//     { title: "Questions for teambuilding (copy)", date: "12 Jan 2025" },
//     { title: "Project Deadline Discussion", date: "01 Feb 2025" },
//     { title: "Team Meeting", date: "23 Jan 2025" },
//     // Add more events here
//   ]);

//   // Handle search input change
//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchQuery(e.target.value);
//   };

//   // Handle sort option change
//   const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setSortOption(e.target.value);
//   };

//   // Function to filter and sort events based on the search query and sort option
//   const getFilteredAndSortedEvents = () => {
//     let filteredEvents = events.filter((event) =>
//       event.title.toLowerCase().includes(searchQuery.toLowerCase())
//     );

//     if (sortOption === "most-recent") {
//       filteredEvents = filteredEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
//     } else if (sortOption === "oldest") {
//       filteredEvents = filteredEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
//     }

//     return filteredEvents;
//   };

//   return (
//     <BaseLayout>
//       <div className="home-container">
//         {/* Sidebar */}
//         <Sidebar />

//         {/* Main Content */}
//         <div className="main-content">
//           {/* App Info Section */}
//           <div className="app-info">
//             <div className="app-details">
//               <h1>
//                 Welcome to <span className="highlight">Q-Code</span>
//               </h1>
//               <p>
//                 Q-Code makes quiz creation effortless and enjoyable! Build
//                 engaging quizzes for education, teambuilding, and fun. Get started
//                 today and unleash your creativity.
//               </p>
//             </div>
//           </div>

//           {/* My Events Section */}
//           <div className="header">
//             <h2>My Events</h2>
//             <div>
//               <button
//                 className="create-event-btn"
//                 onClick={() => console.log("Create Event clicked")}
//               >
//                 + Create Event
//               </button>
//               <button
//                 className="import-event-btn"
//                 onClick={() => console.log("Import Event clicked")}
//               >
//                 Import Event
//               </button>
//             </div>
//           </div>

//           {/* Search and Sorting Section */}
//           <div className="search-sort">
//             <input
//               type="text"
//               placeholder="Search events..."
//               className="search-input"
//               value={searchQuery}
//               onChange={handleSearchChange}
//             />
//             <select
//               className="sort-select"
//               value={sortOption}
//               onChange={handleSortChange}
//             >
//               <option value="most-recent">Most Recent</option>
//               <option value="oldest">Oldest</option>
//             </select>
//           </div>

//           {/* Event List Section */}
//           <div className="event-list">
//             {getFilteredAndSortedEvents().map((event, index) => (
//               <div className="event-item" key={index}>
//                 <div className="event-title">{event.title}</div>
//                 <div className="event-date">{event.date}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </BaseLayout>
//   );
// }

import BaseLayout from "./baselayout";
import Sidebar from "./sidebar";
import Link from "next/link";

export default function Home() {
  return (
    <BaseLayout>
      <div className="home-container">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="main-content">
          {/* App Info Section */}
          <div className="app-info">
            <img
              src="/benefits-of-solving-rubiks-cube.jpg"
              alt="Quiz Making"
              className="app-photo"
            />
            <div className="app-details">
              <h1>Welcome to <span className="highlight">Q-Code</span></h1>
              <p>
                Q-Code makes quiz creation effortless and enjoyable! Build engaging quizzes
                for education, teambuilding, and fun. Get started today and unleash
                your creativity.
              </p>
            </div>
          </div>

          {/* My Events Section */}
          <div className="header">
            <h2>My Events</h2>
            <div>
              <Link href="/Home/create-quiz">
                <button className="create-event-btn">+ Create Event</button>
              </Link>
              <button className="import-event-btn">Import Event</button>
            </div>
          </div>

          {/* Search and Sorting Section */}
          <div className="search-sort">
            <input
              type="text"
              placeholder="Search..."
              className="search-input"
            />
            <select className="sort-select">
              <option value="most-recent">Most Recent</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>

          {/* Event List Section */}
          <div className="event-list">
            <div className="event-item">
              <div className="event-title">Questions for teambuilding (copy)</div>
              <div className="event-date">12 Jan 2025</div>
            </div>
            <div className="event-item">
              <div className="event-title">Project Deadline Discussion</div>
              <div className="event-date">01 Feb 2025</div>
            </div>
            <div className="event-item">
              <div className="event-title">Team Meeting</div>
              <div className="event-date">23 Jan 2025</div>
            </div>
            {/* Add more events as needed */}
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
