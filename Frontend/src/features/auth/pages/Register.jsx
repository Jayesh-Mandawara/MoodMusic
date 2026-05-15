import "../style/register.scss";
import FormGroup from "../components/FormGroup";
import { Link } from "react-router";

const Register = () => {
    return (
        <main className="register-page">
            <div className="form-container">
                <h1>Register</h1>
                <form>
                    <FormGroup label="Name" placeholder="Name" />
                    <FormGroup label="Email" placeholder="Email" />
                    <FormGroup label="Password" placeholder="Password" />
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
