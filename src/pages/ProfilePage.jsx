import { useState, useEffect, useCallback } from "react";
import { Container, Row, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import ProfileTopBar from "../components/ProfileTopBar";
import { Button, Form } from "react-bootstrap";
import { storage } from "../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const ProfilePage = () => {
  const [username, setUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicURL, setProfilePicURL] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const fetchUserProfile = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;

      setLoading(true);
      try {
        const response = await fetch(
          `https://71614d2a-dc59-4978-860d-9efccce24f05-00-2enh7o89sfh7s.pike.replit.dev/users?user_id=${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUsername(data[0].username);
          setProfilePicURL(data[0].profilePicURL || "");
        } else {
          console.error("Error:", response.status, response.statusText);
          setError("Failed to load user profile.");
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("An error occurred while fetching the user profile.");
      } finally {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));
      const token = localStorage.getItem("authToken");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;

      const storageRef = ref(storage, `profile_pictures/${userId}/${file.name}`);
      try {
        setLoading(true);

        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
          },
          (error) => {
            console.error("Upload Error:", error);
            setError("Failed to upload profile picture.");
            setLoading(false);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              setProfilePicURL(downloadURL);

              const response = await fetch(
                `https://71614d2a-dc59-4978-860d-9efccce24f05-00-2enh7o89sfh7s.pike.replit.dev/users/${userId}/updateProfilePic`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({ profilePicURL: downloadURL }),
                }
              );

              if (!response.ok) {
                throw new Error("Failed to save profile picture URL to backend.");
              }

              setSuccess("Profile picture uploaded successfully!");
            } catch (err) {
              console.error("Upload Error:", err);
              setError("Failed to upload profile picture.");
            } finally {
              setLoading(false);
            }
          }
        );
      } catch (err) {
        console.error("Upload Error:", err);
        setError("Failed to upload profile picture.");
        setLoading(false);
      }
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("You need to be logged in to reset the password.");
      return;
    }

    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id;

    setLoading(true);
    const resetData = {
      userId,
      oldPassword,
      newPassword,
    };

    try {
      const response = await fetch(
        "https://71614d2a-dc59-4978-860d-9efccce24f05-00-2enh7o89sfh7s.pike.replit.dev/resetpassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(resetData),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Something went wrong");
      }

      setSuccess("Password reset successfully!");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
        <Container>
          {loading ? (
            <div className="text-center mt-5">
              <Spinner animation="border" role="status">
                <span className="sr-only"></span>
              </Spinner>
            </div>
          ) : (
            <>
              <h2>Profile Information</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}
              <Form>
                <Form.Group controlId="formUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </Form.Group>
              </Form>

              <h2 className="mt-4">Profile Picture</h2>
              {profilePic ? (
                <div className="mb-3">
                  <img
                    src={profilePic}
                    alt="Preview"
                    style={{ width: "150px", height: "150px", borderRadius: "50%" }}
                  />
                </div>
              ) : (
                profilePicURL && (
                  <div className="mb-3">
                    <img
                      src={profilePicURL}
                      alt="Uploaded"
                      style={{ width: "150px", height: "150px", borderRadius: "50%" }}
                    />
                  </div>
                )
              )}
              <Form.Group controlId="formProfilePicture" className="mb-3">
                <Form.Label>Upload Profile Picture</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                />
              </Form.Group>

              <h2 className="mt-4">Reset Password</h2>
              <Form onSubmit={handleResetPassword}>
                <Form.Group controlId="formOldPassword">
                  <Form.Label>Old Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter old password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formNewPassword">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="mt-3"
                  disabled={loading}
                >
                  Reset Password
                </Button>
              </Form>
            </>
          )}
        </Container>
      </Row>
    </Container>
  );
};

export default ProfilePage;
