import { useState, useEffect } from 'react';

export type ExperienceEntry = {
  title: string;
  company: string;
  period?: string;
  details: string[];
};

const useExperience = () => {
  const [experiences, setExperiences] = useState<ExperienceEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/experience');
        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error ?? 'Failed to fetch experience');
        }
        const data = await response.json();
        setExperiences(data);
      } catch (error) {
        console.error('Error fetching experience:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchExperience();
  }, []);

  return { experiences, loading };
};

export default useExperience;
