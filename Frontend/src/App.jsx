// import FaceExpression from './features/expression/components/FaceExpression'
import { RouterProvider } from "react-router";
import { router } from "./app.routes";
import "./shared/global.scss";
import { AuthProvider } from "./features/auth/auth.context";

const App = () => {
    return (
        // <FaceExpression />
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    );
};

export default App;
