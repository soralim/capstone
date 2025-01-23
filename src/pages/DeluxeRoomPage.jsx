import { Container, Row, Col, Button } from "react-bootstrap";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "use-local-storage";
import ProfileTopBar from "../components/ProfileTopBar";
import { jwtDecode } from "jwt-decode";
import deluxeImage from '/deluxe.jpg';

export default function DeluxeRoomPage() {
  const [authToken, setAuthToken] = useLocalStorage("authToken", "");
  const [profilePicURL, setProfilePicURL] = useState("");
  const navigate = useNavigate();

  // Fetch user profile information
  const fetchUserProfile = useCallback(async () => {
    if (authToken) {
      const decodedToken = jwtDecode(authToken);
      const userId = decodedToken.id;

      try {
        const response = await fetch(
          `https://71614d2a-dc59-4978-860d-9efccce24f05-00-2enh7o89sfh7s.pike.replit.dev/users?user_id=${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setProfilePicURL(data[0]?.profilePicURL || "");
        } else {
          console.error("Failed to fetch user profile:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }
  }, [authToken]);

  useEffect(() => {
    if (!authToken) {
      navigate("/login");
    } else {
      fetchUserProfile();
    }
  }, [authToken, navigate, fetchUserProfile]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setAuthToken("");
    navigate("/login");
  };

  return (
    <Container>
      {/* Profile Top Bar */}
      <Row>
        <ProfileTopBar handleLogout={handleLogout} profilePicURL={profilePicURL} />
      </Row>

      {/* Deluxe Room Content */}
      <Row className="mt-4">
  <Col>
    {/* Room Image */}
    <div
      style={{
        width: "100%",
        height: "400px",
        overflow: "hidden",
        borderRadius: "8px",
      }}
    >
      <img
        src={deluxeImage}
        alt="Deluxe Room"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      />
    </div>

    {/* Room Description & Benefits */}
    <div className="mt-4">
      <h2>Deluxe Room</h2>
      <p>
        A Deluxe Room offers an upgraded stay with more space, premium amenities, and luxury finishes. Whether you`&apos;`re
        relaxing after a busy day or enjoying a staycation, the deluxe room is designed to meet all your needs with
        elegance and comfort.
      </p>
      <h4>Benefits of a Deluxe Room:</h4>
      <ul>
        <li>Spacious interiors with modern furnishings</li>
        <li>Complimentary high-speed Wi-Fi</li>
        <li>King-sized bed with premium linens</li>
        <li>Enhanced bathroom amenities</li>
        <li>Exclusive access to the lounge area</li>
      </ul>
      <h3>Price: RM250 per night</h3>

      {/* Booking Button */}
      <Button
        variant="primary"
        size="lg"
        onClick={() => navigate("/booking")}
        style={{ marginTop: "20px" }}
      >
        Book Now
      </Button>
    </div>
  </Col>
</Row>
    </Container>
  );
}
