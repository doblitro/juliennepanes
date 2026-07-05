import { useState, useEffect } from 'react';

export type SkillCategory = {
  label: string;
  items: string[];
};

const useSkills = () => {
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/skills');
        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error ?? 'Failed to fetch skills');
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching skills:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  return { categories, loading };
};

export default useSkills;
