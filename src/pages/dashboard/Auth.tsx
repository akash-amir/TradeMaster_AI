import AuthComponent from "../../dashboard/components/AuthComponent";
import { Button } from "../../dashboard/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <Button
        onClick={() => navigate("/")}
        className="mb-8 self-start ml-4 mt-4 px-4 py-2 bg-[#00C896] hover:bg-[#00BFFF] text-white font-semibold rounded-lg shadow-md flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Landing
      </Button>
      <AuthComponent />
    </div>
  );
} 