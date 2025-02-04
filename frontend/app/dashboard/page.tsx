import BaseLayout from "./baselayout";
import Sidebar from "./sidebar";

export default function Dashboard() {
  return (
    <BaseLayout>
      <div className="home-container">
        {/* Sidebar */}
      

        {/* Main Content */}
        <div className="main-content">
          {/* App Info Section */}
          <div className="app-info">
            {/* <img
              src="/benefits-of-solving-rubiks-cube.jpg" 
              alt="Quiz Making"
              className="app-photo"
            /> */}
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
              <button className="create-event-btn">+ Create Event</button>
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
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
