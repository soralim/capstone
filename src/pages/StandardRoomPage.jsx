import { Container, Row, Col, Button } from "react-bootstrap";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "use-local-storage";
import ProfileTopBar from "../components/ProfileTopBar";
import { jwtDecode } from "jwt-decode";
import standardRoomImage from '/Standard.jpg'; // Assuming the new image for Standard Room

export default function StandardRoomPage() {
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
    setAuthToken("");
    navigate("/login");
  };

  return (
    <Container>
      {/* Profile Top Bar */}
      <Row>
        <ProfileTopBar handleLogout={handleLogout} profilePicURL={profilePicURL} />
      </Row>

      {/* Standard Room Content */}
      <Row className="mt-4">
        <Col>
          {/* Room Image */}
          <div
            style={{
              width: "100%",
              height: "400px",  // Fixed height to fit the frame
              overflow: "hidden",
              borderRadius: "8px",
            }}
          >
            <img
              src={standardRoomImage} // Updated image for Standard Room
              alt="Standard Room"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain", // Ensure the whole image fits in the container
              }}
            />
          </div>

          {/* Room Description & Benefits */}
          <div className="mt-4">
            <h2>Standard Room</h2>
            <p>
              A Standard Room offers a comfortable and cozy stay with all the essential amenities you need for a pleasant
              experience. Perfect for both business and leisure travelers, this room is designed for your convenience and
              relaxation.
            </p>
            <h4>Benefits of a Standard Room:</h4>
            <ul>
              <li>Comfortable furnishings for a relaxing stay</li>
              <li>Complimentary high-speed Wi-Fi</li>
              <li>Queen-sized bed with comfortable linens</li>
              <li>Basic bathroom amenities</li>
              <li>Access to hotel facilities such as the restaurant and gym</li>
            </ul>
            <h3>Price: RM150 per night</h3>

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
