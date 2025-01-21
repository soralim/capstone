import { Container } from "react-bootstrap";
import { FaHome, FaBookmark, FaDoorClosed, FaUser } from "react-icons/fa";
import IconButton from "./IconButton";
import { useNavigate } from "react-router-dom";

export default function ProfileTopBar({ handleLogout, profilePicURL }) {
  const navigate = useNavigate();
  const iconStyle = { marginRight: "0.5rem" };

  const confirmLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      handleLogout();
    }
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-between align-items-center bg-light"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        padding: "0.5rem",
        width: "100%",
      }}
    >
      <div className="d-flex">
        <IconButton
          className="d-flex align-items-center"
          text="Reservation"
          onClick={() => navigate("/view")}
          aria-label="Navigate to reservation page"
        >
          <FaHome style={iconStyle} />
        </IconButton>

        <IconButton
          className="d-flex align-items-center"
          text="Booking"
          onClick={() => navigate("/booking")}
          aria-label="Navigate to booking page"
        >
          <FaBookmark style={iconStyle} />
        </IconButton>

        <IconButton
          className="d-flex align-items-center"
          text="Profile"
          onClick={() => navigate("/profile")}
          aria-label="Navigate to profile page"
        >
          {profilePicURL ? (
            <img
              src={profilePicURL}
              alt="Profile"
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                marginRight: "0.5rem",
                objectFit: "cover",
              }}
              onError={(e) => {
                console.error("Error loading profile picture:", e);
                e.target.src = "/default-profile-image.png";
              }}
            />
          ) : (
            <FaUser style={{ marginRight: "0.5rem" }} />
          )}
        </IconButton>

        <IconButton
          className="d-flex align-items-center"
          text="Logout"
          onClick={confirmLogout}
          aria-label="Log out"
        >
          <FaDoorClosed style={iconStyle} />
        </IconButton>
      </div>

      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          overflow: "hidden",
          backgroundColor: "white", 
        }}
      >
        {profilePicURL ? (
          <img
            src={profilePicURL}
            alt="Profile"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            onError={(e) => {
              console.error("Error loading profile picture:", e);
              e.target.src = "/default-profile-image.png"; 
            }}
          />
        ) : (
          <FaUser style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        )}
      </div>
    </Container>
  );
}
