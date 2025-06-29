import React, { useState, useEffect } from 'react';
import { createTheme, styled } from '@mui/material/styles';
import {
  Snackbar,
  Alert,
  Typography,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import VisibilityIcon from '@mui/icons-material/Visibility';
import UpdateIcon from '@mui/icons-material/Update';
import LogoutIcon from '@mui/icons-material/Logout';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import logoImage from '../assets/tasks.png';
import axios from 'axios';
import { motion } from 'framer-motion';

import MemberTasks from './MemberTasks';
import UpdateStatus from './UpdateStatus';
import DashboardTeam from './DashboardTeam';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

const NAVIGATION = [
  {
    kind: 'header',
    title: 'Team Member',
  },
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'tasks',
    title: 'Tasks',
    icon: <AssignmentTurnedInIcon />,
    children: [
      {
        segment: 'view',
        title: 'View',
        icon: <VisibilityIcon />,
      },
      {
        segment: 'update',
        title: 'Update Status',
        icon: <UpdateIcon />,
      },
    ],
  },
  {
    segment: 'logout',
    title: 'Logout',
    icon: <LogoutIcon />,
  },
];

const demoTheme = createTheme({
  palette: {
    primary: {
      main: '#0054a8',
    },
    secondary: {
      main: '#0582ff',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 500
    }
  },
  colorSchemes: { light: true, dark: true },
  cssVariables: {
    colorSchemeSelector: 'class',
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function useDemoRouter(initialPath) {
  const [pathname, setPathname] = useState(initialPath);
  const router = React.useMemo(() => ({
    pathname,
    searchParams: new URLSearchParams(),
    navigate: (path) => setPathname(String(path)),
  }), [pathname]);
  return router;
}

function Teammember({ window: win }) {
  const router = useDemoRouter('/dashboard');
  const demoWindow = win ? win() : undefined;

  const [tasks, setTasks] = useState([]);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [unseenCount, setUnseenCount] = useState(0);

  useEffect(() => {
    const memberName = localStorage.getItem('loggedInMember');
    if (!memberName) {
      console.warn("No member name found in localStorage");
      return;
    }

    axios.get("http://localhost:5000/tasks").then((res) => {
      const filtered = res.data.filter(task => task.assignedTo === memberName);
      setTasks(filtered);

      const unseen = filtered.filter(task => task.seen === false);
      if (unseen.length > 0) {
        setUnseenCount(unseen.length);
        setShowSnackbar(true);

        // Mark these tasks as seen
        axios.post("http://localhost:5000/tasks/mark-seen", {
          ids: unseen.map(t => t._id)
        }).catch(err => {
          console.error("Error marking tasks as seen:", err);
        });
      }
    }).catch((error) => {
      console.error("Error fetching tasks:", error);
    });
  }, []);

  const renderContent = () => {
    const basePath = router.pathname.split('/')[1];
    const subPath = router.pathname.split('/')[2];

    if (basePath === 'logout') {
      localStorage.removeItem('loggedInMember');
      globalThis.location.href = '/';
      return null;
    }

    if (basePath === 'dashboard') {
      return <DashboardTeam tasks={tasks} />;
    }

    if (basePath === 'tasks') {
      if (subPath === 'view') {
        return <MemberTasks tasks={tasks} />;
      }
      if (subPath === 'update') {
        return <UpdateStatus tasks={tasks} setTasks={setTasks} />;
      }
    }

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Typography 
          variant="h5" 
          sx={{ 
            color: '#0054a8',
            fontWeight: 600
          }}
        >
          Welcome Team Member! Select an option from the sidebar.
        </Typography>
      </motion.div>
    );
  };

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      window={demoWindow}
      branding={{
        logo: <img src={logoImage} alt="Logo" />,
        title: 'Team Member',
      }}
    >
      <DashboardLayout>
        <PageContainer title=''>
          {renderContent()}
        </PageContainer>

        {/*  Snackbar notification */}
       <Snackbar
  open={showSnackbar}
  autoHideDuration={4000}
  onClose={() => setShowSnackbar(false)}
  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
>
  <Alert
    icon={
      <NotificationsNoneIcon
        sx={{
          color: '#0054a8',
          border: '2px solid #0054a8',
          borderRadius: '50%',
          padding: '2px',
        }}
      />
    }
    onClose={() => setShowSnackbar(false)}
    severity="info"
    sx={{ width: '100%', fontWeight: 500 }}
  >
    {`${localStorage.getItem('loggedInMember')}, you have ${unseenCount} new task${unseenCount > 1 ? 's' : ''}!`}
  </Alert>
</Snackbar>

      </DashboardLayout>
    </AppProvider>
  );
}

export default Teammember;

