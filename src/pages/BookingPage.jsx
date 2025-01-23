import { useState, useEffect, useCallback } from 'react';
import { Button, Form, Container, Row, Col, Alert } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';
import ProfileTopBar from '../components/ProfileTopBar';
import { useNavigate } from 'react-router-dom';
import { gapi } from 'gapi-script'; 
import useLocalStorage from 'use-local-storage';

const CLIENT_ID = "639313723439-tlcpn5kjsr437odp9mmrdq5d6c0990ai.apps.googleusercontent.com"; 
const API_KEY = "AIzaSyCoe9PNph3JSFwFT9rUhAKwr3iSRAC5xxo";
const SCOPES = "https://www.googleapis.com/auth/gmail.send";

const BookingPage = () => {
    const [title, setTitle] = useState('');
    const [roomType, setRoomType] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSignedIn, setIsSignedIn] = useState(false);
    const navigate = useNavigate();
    const [authToken, setAuthToken] = useLocalStorage("authToken", "");
  const [profilePicURL, setProfilePicURL] = useState("");

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

    useEffect(() => {
        gapi.load("client:auth2", () => {
            gapi.client.init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                scope: SCOPES,
                discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"],
            }).then(() => {
                const authInstance = gapi.auth2.getAuthInstance();
                setIsSignedIn(authInstance.isSignedIn.get());
                authInstance.isSignedIn.listen(setIsSignedIn); 
                console.log("Auth instance: ", authInstance); 
                console.log("Sign-in status: ", authInstance.isSignedIn.get());
            }).catch((error) => {
                console.error("Error initializing the gapi client: ", error);
            });
        });
    }, []);

    const signIn = () => {
        const authInstance = gapi.auth2.getAuthInstance();
        authInstance.signIn().then(() => {
            setIsSignedIn(true);
        }).catch((err) => {
            console.error("Error signing in", err);
        });
    };

    const signOut = () => {
        gapi.auth2.getAuthInstance().signOut().then(() => {
            setIsSignedIn(false);
        });
    };

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        setAuthToken("");
        navigate('/login');
    };

    const resetState = async () => {
        setTitle('');
        setRoomType('');
        setDate('');
        setTime('');
        setPhoneNumber('');
        setEmail('');
        setError('');
    };

    const sendEmail = async (emailAddress, bookingDetails) => {
    const emailContent = [
        `To: ${emailAddress}`,
        "Subject: Booking Confirmation",
        "",
        "Dear User,",
        "",
        "Thank you for your booking. Here are the details:",
        "",
        `Title: ${bookingDetails.title}`,
        `Room Type: ${bookingDetails.room_type}`,
        `Date: ${bookingDetails.date}`,
        `Time: ${bookingDetails.time}`,
        `Phone Number: ${bookingDetails.phone_number}`,
        "",
        "Thank you for choosing our service.",
    ].join("\n");

    const encodedMessage = btoa(emailContent)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, ""); 

    try {
        const response = await gapi.client.gmail.users.messages.send({
            userId: "me",
            resource: {
                raw: encodedMessage, 
            },
        });

        console.log("Email sent successfully", response);
    } catch (error) {
        console.error("Error sending email", error);
    }
};

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isSignedIn) {
            setError("You need to sign in with your Google account to proceed.");
            return;
        }

        const token = localStorage.getItem("authToken");
        if (!token) {
            setError("You need to be logged in to create a booking.");
            return;
        }

        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;

        const bookingData = {
            title,
            room_type: roomType,
            date,
            time,
            phone_number: phoneNumber,
            email,
            user_id: userId,
        };

        try {
            const response = await fetch('https://71614d2a-dc59-4978-860d-9efccce24f05-00-2enh7o89sfh7s.pike.replit.dev/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(bookingData),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Something went wrong');
            }

            setSuccess("Booking created successfully!");
            resetState();

            await sendEmail(email, bookingData);

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <Container>
            <Row>
            <ProfileTopBar handleLogout={handleLogout} profilePicURL={profilePicURL} />
                <Col sm={10}>
                    <Container className="mt-5">
                        <h2>Create a Booking</h2>
                        {error && <Alert variant="danger">{error}</Alert>}
                        {success && <Alert variant="success">{success}</Alert>}
                        
                        {!isSignedIn ? (
                            <Button variant="primary" onClick={signIn}>Sign In with Google</Button>
                        ) : (
                            <Button variant="secondary" onClick={signOut}>Sign Out</Button>
                        )}

                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="formTitle">
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter booking title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="formRoomType">
                                <Form.Label>Room Type</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={roomType}
                                    onChange={(e) => setRoomType(e.target.value)}
                                    required
                                >
                                    <option value="">Select room type</option>
                                    <option value="Single Room">Single Room</option>
                                    <option value="Double Room">Double Room</option>
                                    <option value="Suite">Suite</option>
                                    <option value="Deluxe Suite">Deluxe Suite</option>
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="formDate">
                                <Form.Label>Date</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="formTime">
                                <Form.Label>Time</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="formPhoneNumber">
                                <Form.Label>Phone Number</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter your phone number"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="formEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Button variant="primary" type="submit" className="mt-3">
                                Create Booking
                            </Button>
                        </Form>
                    </Container>
                </Col>
            </Row>
        </Container>
    );
};

export default BookingPage;
