import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <>
    <Helmet>
      <title>Página no encontrada (404) | Ai Tor</title>
      <meta name="description" content="La ruta solicitada no existe en Ai Tor. Vuelve al terminal de inteligencia en tiempo real para seguir explorando OSINT y mercados." />
      <meta name="robots" content="noindex" />
      <meta property="og:title" content="Página no encontrada (404) | Ai Tor" />
      <meta property="og:description" content="La ruta solicitada no existe en Ai Tor. Vuelve al terminal de inteligencia en tiempo real." />
    </Helmet>
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          Return to Home
        </a>
      </div>
    </div>
    </>
  );
};

export default NotFound;
