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
import { auth } from "./firebase";
import ProtectedRoute from "./components/protected_route";
import NotFound from "./components/not_found";
import KakaoCallback from "./routes/kakao_callback";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
  {
    path: "/sign-in",
    element: <Login />,
  },
  {
    path: "/sign-up",
    element: <CreateAccount />,
  },
  {
    path: "/kakao-callback",
    element: <KakaoCallback />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

const GlobalStyles = createGlobalStyle`
  ${reset};
  * {
    box-sizing: border-box;
  }
  body {
    background-color: black;
    color:white;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
`;

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
`;

function App() {
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    let isMounted = true;
    (async () => {
      await auth.authStateReady();
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