import { Navigate } from 'react-router-dom';

// Dashboard removed — redirect to SPA tickets entry
export default function Dashboard() {
    return <Navigate to="/tickets" replace />;
}
