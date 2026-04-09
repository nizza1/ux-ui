import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
  isRouteErrorResponse,
  Link,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import globalStyles from "./styles/global.css?url";
import { AppLayout } from "./components/layout/AppLayout";
import { AlertTriangle, Home } from "lucide-react";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: globalStyles },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        {/* Prevent theme flash on load */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'light';
                  document.documentElement.setAttribute('data-theme', theme);
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <AppLayout />
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  const isNotFound = isRouteErrorResponse(error) && error.status === 404;

  return (
    <div className="min-h-screen bg-(--bg-base) flex items-center justify-center p-8 font-sans">
      <div className="text-center max-w-100">
        <div
          className={`w-14 h-14 rounded-2xl border flex items-center justify-center mx-auto mb-6 ${
            isNotFound
              ? "bg-(--accent-dim) border-(--accent-border) text-(--accent-text)"
              : "bg-(--bad-bg) border-(--bad-border) text-(--bad-color)"
          }`}
        >
          <AlertTriangle size={24} />
        </div>

        <h1 className="text-[28px] font-extrabold text-(--text-primary) mt-0 mb-2 tracking-tight">
          {isNotFound ? "Page Not Found" : "Something went wrong"}
        </h1>

        <p className="text-[15px] text-(--text-secondary) mt-0 mb-8 leading-[1.6]">
          {isNotFound
            ? "The page you're looking for doesn't exist."
            : "An unexpected error occurred. Please try again."}
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 py-2.5 px-5 bg-(--accent) text-white rounded-lg no-underline text-sm font-semibold"
        >
          <Home size={15} />
          Back to Workshop
        </Link>
      </div>
    </div>
  );
}
