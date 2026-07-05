'use client';

import { useState } from 'react';
import Section from '../ui/Section';
import useSkills from '../hooks/useSkills';

const localLogos: Record<string, string> = {
  angular: '/logos/angular.svg',
  aws: '/logos/aws.svg',
  figma: '/logos/figma.svg',
  git: '/logos/git.svg',
  java: '/logos/java.svg',
  jira: '/logos/jira.svg',
  laravel: '/logos/laravel.svg',
  mysql: '/logos/mysql.svg',
  nextjs: '/logos/nextjs.svg',
  postgresql: '/logos/pgsql.svg',
  reactnative: '/logos/reactnative.svg',
  redmine: '/logos/redmine.svg',
  springboot: '/logos/spring.svg',
  tailwindcss: '/logos/tailwindcss.svg',
};

const simpleIconSlugs: Record<string, string> = {
  html5: 'html5',
  css: 'css',
  javascript: 'javascript',
  typescript: 'typescript',
  reactjs: 'react',
  chakrau: 'chakraui',
  chakraui: 'chakraui',
  mui: 'mui',
  junit: 'junit5',
  n8n: 'n8n',
};

const noIconSlugs = new Set(['seo']);

const normalize = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, '');

const iconFor = (name: string) => {
  const key = normalize(name);
  if (localLogos[key]) return localLogos[key];
  if (simpleIconSlugs[key]) return `https://cdn.simpleicons.org/${simpleIconSlugs[key]}`;
  return `https://cdn.simpleicons.org/${key}`;
};

const TechStackItem = ({ name }: { name: string }) => {
  const [iconFailed, setIconFailed] = useState(() => noIconSlugs.has(normalize(name)));

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/[0.07] bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/[0.14] transition-all duration-200">
      {!iconFailed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={iconFor(name)}
          alt={`${name} logo`}
          className="w-4 h-4 flex-shrink-0 object-contain drop-shadow-[0_1px_7px_rgba(255,255,255,0.4)]"
          draggable={false}
          onError={() => setIconFailed(true)}
        />
      )}
      <span className="text-xs text-foreground/60 font-medium">{name}</span>
    </div>
  );
};

const TechStackSkeleton = () => (
  <div className="flex flex-col gap-6 animate-pulse">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i}>
        <div className="h-2.5 w-32 rounded bg-white/[0.06] mb-3" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 5 }).map((_, j) => (
            <div key={j} className="h-7 w-20 rounded-md bg-white/[0.04]" />
          ))}
        </div>
      </div>
    ))}
  </div>
);

const TechStack = () => {
  const { categories, loading } = useSkills();

  return (
    <Section title="Tech Stack" aria-label="Tech Stack Section">
      {loading ? (
        <TechStackSkeleton />
      ) : (
        <div className="flex flex-col gap-6">
          {categories.map((cat) => (
            <div key={cat.label}>
              <p className="text-xs text-foreground/30 uppercase tracking-widest mb-3">
                {cat.label}
              </p>
              <div className="flex flex-wrap gap-2">
                {cat.items.map((item) => (
                  <TechStackItem key={item} name={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
};

export default TechStack;
