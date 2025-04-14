import "bootstrap/dist/css/bootstrap.min.css"; 
import "@/styles/globals.css"; 
import Layout from "@/components/Layout"; 
import RouteGuard from "@/components/RouteGuard"; 
import { SWRConfig } from "swr";

export default function App({ Component, pageProps }) {
  return (
    <SWRConfig
      value={{
        fetcher: async (url) => {
          const res = await fetch(url);
          if (!res.ok) {
            const error = new Error("An error occurred while fetching the data.");
            error.info = await res.json();
            error.status = res.status;
            throw error;
          }
          return res.json();
        }
      }}
    >
      <RouteGuard> {/* ✅ Wrap everything inside RouteGuard */}
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </RouteGuard>
    </SWRConfig>
  );
}
