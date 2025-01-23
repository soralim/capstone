import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import useLocalStorage from "use-local-storage";
import { jwtDecode } from "jwt-decode";
import ProfileTopBar from "../components/ProfileTopBar"; // Import the top bar

import image from '/hotel.png'
import deluxeImage from '/deluxe.jpg';
import suiteImage from '/suite.jpg';
import standardImage from '/Standard.jpg';

export default function StardewHotel() {
  const [authToken, setAuthToken] = useLocalStorage("authToken", "");
  const [profilePicURL, setProfilePicURL] = useState("");
  const navigate = useNavigate();

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
    <Container fluid>
      {/* Top Bar Section */}
      <Row>
        <ProfileTopBar handleLogout={handleLogout} profilePicURL={profilePicURL} />
      </Row>

      {/* Banner Section */}
      <Row className="mb-5">
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "400px", 
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <h1
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "white",
              fontSize: "4rem",
              fontWeight: "bold",
              textShadow: "2px 2px 8px rgba(0, 0, 0, 0.7)",
              textAlign: "center",
            }}
          >
            Stardew Hotel
          </h1>
        </div>
      </Row>

      {/* Hotel Summary Section */}
      <Row className="mb-5">
        <Col xs={12}>
          <p
            style={{
              fontSize: "1.5rem",
              textAlign: "center",
              padding: "0 20px", 
            }}
          >
            <strong>
              Welcome to Stardew Hotel, where luxury meets comfort. Enjoy our
              premium services and cozy rooms that make you feel right at home.
              Your perfect stay awaits.
            </strong>
          </p>
        </Col>
      </Row>

      {/* Room Types Section */}
      <Row>
  <Col
    xs={12}
    sm={6}
    md={4}
    className="text-center mb-5" 
  >
    <div
      style={{
        width: "100%",
        height: "250px", 
        backgroundImage: `url(${deluxeImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: "8px",
        marginBottom: "15px", 
      }}
    ></div>
    <h5 style={{ fontSize: "1.5rem" }}>Deluxe Room</h5>
    <Button
      variant="primary"
      size="lg"
      onClick={() => navigate("/deluxe")}
    >
      View Deluxe Room
    </Button>
  </Col>

  <Col
    xs={12}
    sm={6}
    md={4}
    className="text-center mb-5" 
  >
    <div
      style={{
        width: "100%",
        height: "250px", 
        backgroundImage: `url(${suiteImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: "8px",
        marginBottom: "15px", 
      }}
    ></div>
    <h5 style={{ fontSize: "1.5rem" }}>Suite</h5>
    <Button
      variant="primary"
      size="lg"
      onClick={() => navigate("/suite")}
    >
      View Suite
    </Button>
  </Col>

  <Col
    xs={12}
    sm={6}
    md={4}
    className="text-center mb-5" 
  >
    <div
      style={{
        width: "100%",
        height: "250px", 
        backgroundImage: `url(${standardImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: "8px",
        marginBottom: "15px", 
      }}
    ></div>
    <h5 style={{ fontSize: "1.5rem" }}>Standard Room</h5>
    <Button
      variant="primary"
      size="lg"
      onClick={() => navigate("/standard")}
    >
      View Standard Room
    </Button>
  </Col>
</Row>
    </Container>
  );
}
