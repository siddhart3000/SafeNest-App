import { useEffect, useState } from "react";
import { FamilyMember, subscribeToFamilyMembers } from "../services/familyService";

interface UseFamilyMembersResult {
  members: FamilyMember[];
  loading: boolean;
  error: string | null;
}

export const useFamilyMembers = (familyId: string | null): UseFamilyMembersResult => {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState<boolean>(!!familyId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!familyId) {
      setMembers([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToFamilyMembers(familyId, (next) => {
      setMembers(next);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [familyId]);

  return { members, loading, error };
};

