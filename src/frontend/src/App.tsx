import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import GraphCanvas from "./pages/GraphCanvas";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="dark" style={{ colorScheme: "dark" }}>
        <GraphCanvas />
      </div>
    </QueryClientProvider>
  );
}
