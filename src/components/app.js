import Router from "preact-router";
import { Toaster } from "react-hot-toast";
import Header from "./header";

// Code-splitting is automated for `routes` directory
import Home from "../routes/home";
import TradeIn from "../routes/tradein";

import { QueryClient, QueryClientProvider } from "react-query";
import { AuthProvider, useAuth } from "../auth";
import Browse from "../routes/browse";
import Locations from "../routes/location";
import User from "../routes/user";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const App = () => {
  const { auth } = useAuth();
  return (
    <QueryClientProvider client={queryClient}>
      <div id="app" style={{ padding: "24px" }}>
        <Header />
        {auth ? (
          <Router>
            <Home path="/" />
            <TradeIn path="/tradein" />
            <Locations path="/locations" />
            <User path="/users" />
            <Browse path="/browses" />
          </Router>
        ) : null}
      </div>
      <Toaster />
    </QueryClientProvider>
  );
};

const AppWrapper = () => {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
};

export default AppWrapper;
