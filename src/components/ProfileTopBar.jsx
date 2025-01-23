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
        flexWrap: "wrap", // For responsive design
      }}
    >
      <div className="d-flex">
        {/* Home Button */}
        <IconButton
          className="d-flex align-items-center"
          text="Home"
          onClick={() => navigate("/main")}
          aria-label="Navigate to home page"
        >
          <FaHome style={{ ...iconStyle, fontSize: "16px" }} /> {/* Smaller icon */}
        </IconButton>

        {/* Reservation Button */}
        <IconButton
          className="d-flex align-items-center"
          text="Reservation"
          onClick={() => navigate("/view")}
          aria-label="Navigate to reservation page"
        >
          <FaBookmark style={{ ...iconStyle, fontSize: "16px" }} /> {/* Smaller icon */}
        </IconButton>

        {/* Booking Button */}
        <IconButton
          className="d-flex align-items-center"
          text="Booking"
          onClick={() => navigate("/booking")}
          aria-label="Navigate to booking page"
        >
          <FaBookmark style={{ ...iconStyle, fontSize: "16px" }} /> {/* Smaller icon */}
        </IconButton>

        {/* Profile Button */}
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
        width: "25px",
        height: "25px",
        borderRadius: "50%",
        marginRight: "0.5rem",
        objectFit: "cover",
      }}
    />
  ) : (
    <FaUser style={{ marginRight: "0.5rem", fontSize: "16px" }} />
  )}
</IconButton>

        {/* Logout Button */}
        <IconButton
          className="d-flex align-items-center"
          text="Logout"
          onClick={confirmLogout}
          aria-label="Log out"
        >
          <FaDoorClosed style={{ ...iconStyle, fontSize: "16px" }} /> {/* Smaller icon */}
        </IconButton>
      </div>

      {/* Profile Image */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          width: "30px", // Adjusted size for profile image
          height: "30px", // Adjusted size for profile image
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
