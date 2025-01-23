import { Container, Row, Col, Button } from "react-bootstrap";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "use-local-storage";
import ProfileTopBar from "../components/ProfileTopBar";
import { jwtDecode } from "jwt-decode";
import suiteImage from '/suite.jpg'; 

export default function SuiteRoomPage() {
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

      {/* Suite Room Content */}
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
              src={suiteImage}
              alt="Suite Room"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain", 
              }}
            />
          </div>

          {/* Room Description & Benefits */}
          <div className="mt-4">
            <h2>Suite Room</h2>
            <p>
              The Suite Room offers an opulent stay with extra space, a luxurious ambiance, and high-end amenities. Ideal for
              those seeking ultimate comfort and exclusivity, the suite is designed to provide a lavish experience whether for
              work or leisure.
            </p>
            <h4>Benefits of a Suite Room:</h4>
            <ul>
              <li>Spacious living area with premium furnishings</li>
              <li>Complimentary high-speed Wi-Fi and a workstation</li>
              <li>King-sized bed with top-tier linens</li>
              <li>Luxurious bathroom with a soaking tub</li>
              <li>Private balcony with breathtaking views</li>
              <li>Exclusive access to a VIP lounge</li>
            </ul>
            <h3>Price: RM500 per night</h3>

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
