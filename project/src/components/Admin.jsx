import React from 'react';
import { createTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupsIcon from '@mui/icons-material/Groups';
import ArticleIcon from '@mui/icons-material/Article';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LogoutIcon from '@mui/icons-material/Logout';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import logoImage from '../assets/tasks.png';
import ProjectAdmin from './ProjectAdmin';
import TeamsAdmin from './TeamsAdmin';
import TasksAdmin from './TasksAdmin';
import AdminProfileDropdown from "./AdminProfileDropdown";
import DashboardAdmin from './DashboardAdmin';
import { Typography } from '@mui/material';

const NAVIGATION = [
  {
    kind: 'header',
    title: 'Admin',
  },
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'project',
    title: 'Project',
    icon: <ArticleIcon />,
    children: [
      {
        segment: 'add',
        title: 'Add',
        icon: <AddIcon />,
      },
      {
        segment: 'view',
        title: 'View',
        icon: <VisibilityIcon />,
      },
    ],
  },
  {
    segment: 'teams',
    title: 'Teams',
    icon: <GroupsIcon />,
    children: [
      {
        segment: 'add',
        title: 'Add',
        icon: <AddIcon />,
      },
      {
        segment: 'view',
        title: 'View',
        icon: <VisibilityIcon />,
      },
    ],
  },
  {
    segment: 'tasks',
    title: 'Tasks',
    icon: <AssignmentTurnedInIcon />,
    children: [
      {
        segment: 'create',
        title: 'Create',
        icon: <AddIcon />,
      },
      {
        segment: 'view',
        title: 'View',
        icon: <VisibilityIcon />,
      },
    ],
  },
  {
    segment: 'logout',
    title: 'Logout',
    icon: <LogoutIcon />,
  },
];

const adminTheme = createTheme({
  palette: {
    primary: {
      main: '#0054a8',
    },
    secondary: {
      main: '#0582ff',
    },
    background: {
      default: '#f5f7fa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", sans-serif',
    h4: {
      fontWeight: 600,
      color: '#0054a8',
    },
    h5: {
      fontWeight: 500,
      color: '#0054a8',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    }
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px 0 rgba(0, 84, 168, 0.1)',
          border: '1px solid rgba(0, 84, 168, 0.1)',
          background: '#ffffff',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          background: 'linear-gradient(to right, #0054a8, #0582ff)',
          color: 'white',
          '&:hover': {
            background: 'linear-gradient(to right, #0582ff, #0054a8)',
            boxShadow: '0 4px 12px rgba(0, 84, 168, 0.3)'
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          color: '#0054a8',
        },
      },
    },
  },
});

function useDemoRouter(initialPath) {
  const [pathname, setPathname] = React.useState(initialPath);
  const router = React.useMemo(() => ({
    pathname,
    searchParams: new URLSearchParams(),
    navigate: (path) => setPathname(String(path)),
  }), [pathname]);

  return router;
}

function Admin({ window: win }) {
  const router = useDemoRouter('/dashboard');
  const demoWindow = win ? win() : undefined;

  const renderContent = () => {
    const basePath = router.pathname.split('/')[1];

    if (basePath === 'logout') {
      globalThis.location.href = '/';
      return null;
    }

    switch (basePath) {
      case 'dashboard':
        return <DashboardAdmin pathname={router.pathname} router={router} />;
      case 'project':
        return <ProjectAdmin pathname={router.pathname} router={router} />;
      case 'teams':
        return <TeamsAdmin pathname={router.pathname} router={router} />;
      case 'tasks':
        return <TasksAdmin pathname={router.pathname} router={router} />;
      default:
        return (
          <Typography variant="h4" sx={{ textAlign: 'center', mt: 4, color: '#0054a8' }}>
            Welcome to the Admin Dashboard
          </Typography>
        );
    }
  };

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={adminTheme}
      window={demoWindow}
      branding={{
        logo: <img src={logoImage} alt="Logo" style={{ height: 40 }} />,
        title: 'PlanWise Admin',
      }}
    >
      <DashboardLayout
        slots={{
          toolbarActions: () => <AdminProfileDropdown />,
        }}
      >     
        <PageContainer title="">
          {renderContent()}
        </PageContainer>
      </DashboardLayout>
    </AppProvider>
  );
}

export default Admin;