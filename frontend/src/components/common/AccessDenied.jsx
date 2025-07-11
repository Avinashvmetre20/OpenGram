// src/components/common/AccessDenied.jsx
import './AccessDenied.css';

const AccessDenied = ({ requiredRoles = [], currentRole = '' }) => (
  <div className="access-denied">
    <h2>Access Denied</h2>
    <p>
      You don't have permission to access this page.
      {requiredRoles.length > 0 && (
        <>
          <br />
          Required role: {requiredRoles.join(' or ')}
        </>
      )}
      {currentRole && (
        <>
          <br />
          Your role: {currentRole}
        </>
      )}
    </p>
  </div>
);

export default AccessDenied; // Changed to default export