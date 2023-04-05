import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { User as FirebaseUser } from "firebase/auth";

const useUser = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      setUser(user), setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  return { user, isLoading };
};

export default useUser;
