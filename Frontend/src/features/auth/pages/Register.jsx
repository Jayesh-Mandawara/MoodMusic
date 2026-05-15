import "../style/register.scss";
import FormGroup from "../components/FormGroup";
import { Link } from "react-router";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const { loading, handleRegister } = useAuth();

    async function handleSubmit(e) {
        e.preventDefault();
        await handleRegister({ username: name, email, password });
        navigate("/");
    }

    return (
        <main className="register-page">
            <div className="form-container">
                <h1>Register</h1>
                <form onSubmit={handleSubmit}>
                    <FormGroup
                        label="Name"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <FormGroup
                        label="Email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <FormGroup
                        label="Password"
                        placeholder="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="button" type="submit">
                        Register
                    </button>
                    <p>
                        Already have an account? <Link to="/login">Login</Link>
                    </p>
                </form>
            </div>
        </main>
    );
};

export default Register;
