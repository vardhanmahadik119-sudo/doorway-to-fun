import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

const Index = () => {
  const navigate = useNavigate();
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
        navigate("/dashboard");
      } else {
        navigate("/auth");
      }
    }
  }, [isLoaded, isSignedIn, navigate]);

  return null;
};

export default Index;
