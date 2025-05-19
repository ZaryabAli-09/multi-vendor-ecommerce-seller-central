import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const GoogleLogin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const loadGoogleScript = () => {
      try {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = initializeGoogleSignIn;
        script.onerror = () => {
          toast.error("Failed to load Google authentication service");
        };
        document.body.appendChild(script);
      } catch (error) {
        toast.error("Error initializing Google login");
        console.error("Script loading error:", error);
      }
    };

    const initializeGoogleSignIn = () => {
      try {
        /* global google */
        if (window.google) {
          google.accounts.id.initialize({
            client_id:
              "1084598655361-i73p8lv43i7mg5ueqsahdicrq08p7udf.apps.googleusercontent.com",
            callback: handleGoogleResponse,
          });

          google.accounts.id.renderButton(
            document.getElementById("googleSignInDiv"),
            {
              theme: "outline",
              size: "large",
              width: "300",
              text: "continue_with",
              shape: "rectangular",
              logo_alignment: "left",
            }
          );

          // Optional: Show One Tap UI
          google.accounts.id.prompt();
        }
      } catch (error) {
        toast.error("Failed to initialize Google button");
        console.error("Google initialization error:", error);
      }
    };

    if (!window.google) {
      loadGoogleScript();
    } else {
      initializeGoogleSignIn();
    }

    return () => {
      const script = document.querySelector(
        'script[src="https://accounts.google.com/gsi/client"]'
      );
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleGoogleResponse = async (response) => {
    const loadingToast = toast.loading("Signing in with Google...");

    try {
      const googleIdToken = response.credential;

      const res = await fetch("http://localhost:5000/api/buyer/auth/google", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ googleIdToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      toast.success("login successful", { id: loadingToast });
      console.log("success dtaa", data);

      //   navigate("/dashboard"); // Uncomment this line to redirect after successful login
    } catch (error) {
      toast.error(error.message || "Login failed. Please try again.");
    }
  };

  return (
    <div
      id="googleSignInDiv"
      style={{
        marginTop: "20px",
        minWidth: "300px",
        minHeight: "44px",
      }}
    />
  );
};

export default GoogleLogin;
