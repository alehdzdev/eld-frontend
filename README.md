# Spotter Test ELD

A React-based application for planning trips and generating Electronic Logging Device (ELD) logs. This tool allows users to input trip details, visualize the route on an interactive map, and view generated daily driver logs.

## Features

- **Trip Planning**: Calculate routes by specifying Start, Pickup, and Dropoff locations.
- **Route Visualization**: Interactive map display using [Leaflet](https://leafletjs.com/) to show the planned route.
- **ELD Log Generation**: Automatically generates daily driver logs based on the trip plan.
- **Cycle Management**: Input and track used cycle hours.
- **Responsive Design**: Built with [Tailwind CSS](https://tailwindcss.com/) for a modern and responsive user interface.

## Tech Stack

- **Frontend Framework**: React
- **Map Library**: Leaflet
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js (v14 or higher recommended)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd eld-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Environment Configuration:
   Create a `.env` file in the root directory and add your API URL:
   ```env
   REACT_APP_API_URL=http://localhost:8001
   ```
   *(Note: Adjust the URL to match your backend server address)*

### Running the Application

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

## Project Structure

- `src/components`: Reusable UI components (Map, Graph, Input).
- `src/assets`: Static assets like images and logos.
- `src/App.js`: Main application logic and layout.
