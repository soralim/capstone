import { Container, Row } from "react-bootstrap";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "use-local-storage";
import ProfileTopBar from "../components/ProfileTopBar";
import ProfileMidBody from "../components/ProfileMidBody";
import { jwtDecode } from "jwt-decode";

export default function ViewBooking() {
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
    <Container>
      <Row>
        <ProfileTopBar
          handleLogout={handleLogout}
          profilePicURL={profilePicURL}
        />
      </Row>
      <Row>
      <ProfileMidBody />
      </Row>
    </Container>
  );
}
