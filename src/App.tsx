import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./components/layout";
import { Home } from "./routes/home";
import Profile from "./routes/profile";
import { Login } from "./routes/sign_in";
import { CreateAccount } from "./routes/sign_up";
import { createGlobalStyle, styled } from "styled-components";
import reset from "styled-reset";
import { useEffect, useState } from "react";
import LoadingScreen from "./components/loading_screen";
import { supabase } from "./supabase";
import ProtectedRoute from "./components/protected_route";
import NotFound from "./components/not_found";
import KakaoCallback from "./routes/kakao_callback";
import Messages from "./routes/messages.tsx";
import Support from "./routes/support";
import FAQ from "./routes/faq";
import LiveTranslation from "./routes/live_translation.tsx";
import Locations from "./routes/locations";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "", element: <Home /> },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "messages",
        element: (
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        ),
      },
      { path: "support", element: <Support /> },
      { path: "faq", element: <FAQ /> },
      { path: "live-translation", element: <LiveTranslation /> },
      { path: "locations", element: <Locations /> },
    ],
  },
  { path: "/sign-in", element: <Login /> },
  { path: "/sign-up", element: <CreateAccount /> },
  // Allow underscore variants to avoid dead links
  { path: "/sign_in", element: <Login /> },
  { path: "/sign_up", element: <CreateAccount /> },
  { path: "/kakao-callback", element: <KakaoCallback /> },
  { path: "*", element: <NotFound /> },
]);

const GlobalStyles = createGlobalStyle`
  ${reset};
  * { box-sizing: border-box; }
  html, body, #root { height: 100%; }
  body {
    background-color: #ffffff;
    color: #111827;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  a { color: inherit; text-decoration: none; }
`;

const Wrapper = styled.div`
  min-height: 100vh;
  display: block;
`;

function App() {
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    let isMounted = true;
    (async () => {
      await supabase.auth.getSession();
      if (isMounted) setLoading(false);
    })();
    return () => {
      isMounted = false;
    };
  }, []);
  return (
    <Wrapper>
      <GlobalStyles />
      {isLoading ? <LoadingScreen /> : <RouterProvider router={router} />}
    </Wrapper>
  );
}

export default App;