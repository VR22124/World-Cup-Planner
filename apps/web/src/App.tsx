import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from '@/components/theme-provider';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { AppLayout } from '@/components/layout/app-layout';

import FanHub from '@/pages/fan-hub';
import OpsDashboard from '@/pages/ops-dashboard';
import VolunteerHub from '@/pages/volunteer-hub';
import Transport from '@/pages/transport';
import Accessibility from '@/pages/accessibility';
import Alerts from '@/pages/alerts';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: 30000,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={FanHub} />
        <Route path="/operations" component={OpsDashboard} />
        <Route path="/volunteers" component={VolunteerHub} />
        <Route path="/transport" component={Transport} />
        <Route path="/accessibility" component={Accessibility} />
        <Route path="/alerts" component={Alerts} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
