import {
  HeadContent,
  Outlet,
  ScrollRestoration,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import * as React from "react";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "CYNEX Production",
      },
      {
        name: "description",
        content: "CYNEX Production - Creative Agency in Rajkot & Ahmedabad, specializing in video production and branding.",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFoundPage,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <ScrollRestoration />
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function NotFoundPage() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "2rem" }}>
      <div style={{ textAlign: "center" }}>
        <h1>Page not found</h1>
        <p>This page is no longer available.</p>
        <a href="/">Go home</a>
      </div>
    </main>
  );
}
