"use client"

import { useRouter } from "next/navigation";
import { useAuth } from './AuthContext';
import Loader from "@/components/loader";

const ProtectedPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    router.push('/auth/login');
    return null;
  }

  return <div>Welcome, {user.email}</div>;
};

export default ProtectedPage;
