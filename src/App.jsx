import './App.css'
import LoginPage from './pages/LoginPage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ViewBooking from './pages/ViewBooking'
import BookingPage from './pages/BookingPage';
import ProfilePage from './pages/ProfilePage'
import StardewHotel from './pages/MainPage';
import DeluxeRoomPage from './pages/DeluxeRoomPage';
import StandardRoomPage from './pages/StandardRoomPage';
import SuiteRoomPage from './pages/SuiteRoomPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/main"  element={<StardewHotel />} />
        <Route path="/deluxe"  element={<DeluxeRoomPage />} />
        <Route path="/standard"  element={<StandardRoomPage />} />
        <Route path="/suite"  element={<SuiteRoomPage />} />
        <Route path="/view"  element={<ViewBooking />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  )
}

