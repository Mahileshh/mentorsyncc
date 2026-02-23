import { useState } from "react";
import { Container, Card, CardContent, TextField, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await api.post("/login", { email, password });
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("role", res.data.role);
    navigate(`/${res.data.role}`);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            MentorSync
          </Typography>

          <TextField fullWidth label="Email" margin="normal"
            value={email} onChange={(e) => setEmail(e.target.value)} />

          <TextField fullWidth label="Password" type="password" margin="normal"
            value={password} onChange={(e) => setPassword(e.target.value)} />

          <Button fullWidth variant="contained" sx={{ mt: 2 }}
            onClick={handleLogin}>
            Login
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}
