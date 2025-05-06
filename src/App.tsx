
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MessageProvider } from "./context/MessageContext";
import Navbar from "./components/Navbar";
import CreateMessage from "./components/CreateMessage";
import CreatedMessage from "./components/CreatedMessage";
import ViewMessage from "./components/ViewMessage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <MessageProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<CreateMessage />} />
            <Route path="/created/:id" element={<CreatedMessage />} />
            <Route path="/view/:id" element={<ViewMessage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </MessageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
