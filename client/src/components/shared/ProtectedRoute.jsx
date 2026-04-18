// // import { useSelector } from 'react-redux';
// // import { Navigate, useLocation } from 'react-router-dom';

// // // Redirects to /login if not authenticated
// // export const ProtectedRoute = ({ children }) => {
// //   const { isAuthenticated, loading } = useSelector((s) => s.auth);
// //   const location = useLocation();

// //   if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;

// //   if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;

// //   return children;
// // };

// // // Redirects to role-appropriate dashboard if wrong role
// // export const RoleRoute = ({ children, roles }) => {
// //   const { user } = useSelector((s) => s.auth);

// //   if (!user || !roles.includes(user.role)) {
// //     const dashboards = {
// //       admin: '/admin',
// //       manager: '/manager',
// //       staff: '/staff',
// //       kitchen: '/kitchen',
// //       delivery: '/delivery',
// //       customer: '/dashboard',
// //     };
// //     return <Navigate to={dashboards[user?.role] || '/login'} replace />;
// //   }

// //   return children;
// // };
// import { useSelector } from 'react-redux';
// import { Navigate, useLocation } from 'react-router-dom';

// // Redirects to /login if not authenticated
// export const ProtectedRoute = ({ children, requireAuth = true }) => {
//   const { isAuthenticated, loading } = useSelector((s) => s.auth);
//   const location = useLocation();

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="w-8 h-8 border-4 border-[#b97844] border-t-transparent rounded-full animate-spin" />
//       </div>
//     );
//   }

//   // If authentication is required and user is not authenticated, redirect to login
//   if (requireAuth && !isAuthenticated) {
//     return <Navigate to="/login" state={{ from: location.pathname }} replace />;
//   }

//   return children;
// };

// // Redirects to role-appropriate dashboard if wrong role
// export const RoleRoute = ({ children, roles }) => {
//   const { user, isAuthenticated, loading } = useSelector((s) => s.auth);
//   const location = useLocation();

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="w-8 h-8 border-4 border-[#b97844] border-t-transparent rounded-full animate-spin" />
//       </div>
//     );
//   }

//   // If not authenticated, redirect to login
//   if (!isAuthenticated) {
//     return <Navigate to="/login" state={{ from: location.pathname }} replace />;
//   }

//   // If user has no role or role not in allowed roles
//   if (!user || !roles.includes(user.role)) {
//     const dashboards = {
//       admin: '/admin',
//       manager: '/manager',
//       staff: '/staff',
//       kitchen: '/kitchen',
//       delivery: '/delivery',
//       customer: '/',
//     };
//     return <Navigate to={dashboards[user?.role] || '/'} replace />;
//   }

//   return children;
// };

// // For public routes that don't require authentication but can show different content based on auth status
// export const PublicRoute = ({ children }) => {
//   const { isAuthenticated, loading } = useSelector((s) => s.auth);
//   const location = useLocation();

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="w-8 h-8 border-4 border-[#b97844] border-t-transparent rounded-full animate-spin" />
//       </div>
//     );
//   }

//   // If already authenticated and trying to access login/register, redirect to home
//   if (isAuthenticated && (location.pathname === '/login' || location.pathname === '/register')) {
//     return <Navigate to="/" replace />;
//   }

//   return children;
// };


import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import presenceService from '../../services/presenceService';

const getDefaultRouteForRole = (role) => {
  const dashboards = {
    admin: '/admin',
    manager: '/manager',
    staff: '/staff',
    kitchen: '/kitchen',
    delivery: '/delivery',
    customer: '/',
  };

  return dashboards[role] || '/';
};

// Redirects to /login if not authenticated
export const ProtectedRoute = ({ children, requireAuth = true }) => {
  const { isAuthenticated, loading } = useSelector((s) => s.auth);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#b97844] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If authentication is required and user is not authenticated, redirect to login
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: `${location.pathname}${location.search}` }} replace />;
  }

  return children;
};

// Redirects to role-appropriate dashboard if wrong role
export const RoleRoute = ({ children, roles }) => {
  const { user, isAuthenticated, loading } = useSelector((s) => s.auth);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#b97844] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: `${location.pathname}${location.search}` }} replace />;
  }

  // If user has no role or role not in allowed roles
  if (!user || !roles.includes(user.role)) {
    return <Navigate to={getDefaultRouteForRole(user?.role)} replace />;
  }

  return children;
};

// For public routes - redirects to home if already logged in
export const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useSelector((s) => s.auth);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#b97844] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={getDefaultRouteForRole(user?.role)} replace />;
  }

  return children;
};

export const CustomerPublicRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useSelector((s) => s.auth);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#b97844] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthenticated && user?.role && user.role !== 'customer') {
    return <Navigate to={getDefaultRouteForRole(user.role)} replace />;
  }

  return children;
};

const CustomerPresenceRoute = ({ children }) => {
  const { user } = useSelector((s) => s.auth);

  useEffect(() => {
    if (!user?._id || user?.role !== 'customer') return undefined;

    presenceService.initialize(user._id, 'customer', 'Customer Website');

    return () => {
      void presenceService.cleanup();
    };
  }, [user?._id, user?.role]);

  return children;
};

export const CustomerProtectedRoute = ({ children }) => (
  <ProtectedRoute>
    <RoleRoute roles={['customer']}>
      <CustomerPresenceRoute>{children}</CustomerPresenceRoute>
    </RoleRoute>
  </ProtectedRoute>
);
