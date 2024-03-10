# texo-it-code-challenge
Fullstack solution using Python and React

# Todo List

## Backend

### Setup and Initialization
- [x] Setup a Python environment with Flask
- [x] Initialize Flask project for RESTful API development

### Database Setup
- [ ] Design the database schema for movies data
- [ ] Integrate an in-memory database (SQLite or similar)

### Data Import
- [ ] Implement CSV data reading and parsing functionality
- [ ] Insert movie data into the database on application startup

### API Development
- [ ] Create endpoint to fetch producers with maximum and minimum intervals between awards
- [ ] Ensure the API conforms to the level 2 of Richardson Maturity Model
- [ ] Implement additional API filtering capabilities as required

### Testing
- [ ] Write integration tests for API endpoints

### Documentation
- [ ] Document setup, API endpoints, and usage instructions

## Frontend

### Project Setup
- [ ] Initialize React project with necessary tooling
- [ ] Install essential libraries 

### UI Development
- [ ] Implement navigation menu for switching between views
- [ ] Develop the dashboard view with required panels
  - [ ] Years with more than one winner
  - [ ] Top three studios by wins
  - [ ] Producers with longest and shortest win intervals
  - [ ] Searchable winners by year
- [ ] Create the movie list view with pagination and filters (year, winner)

### Responsiveness
- [ ] Ensure UI is responsive with a minimum resolution of 768x1280

### Integration
- [ ] Connect frontend with backend to dynamically fetch and display data

### Testing
- [ ] Write unit tests for UI components and functionality
