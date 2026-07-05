'use client';

import React, { useState } from 'react';
import Section from '../ui/Section';
import { FaChevronDown } from 'react-icons/fa6';
import useExperience, { ExperienceEntry } from '../hooks/useExperience';

type ExperienceType = ExperienceEntry;

const ExperienceItemSkeleton = ({ isLast }: { isLast: boolean }) => (
  <div className="relative pl-9">
    <div className="absolute left-0 top-4 w-[18px] h-[18px] rounded-full border-2 border-[var(--accent-hover)]/50 bg-[var(--sidebar-bg)] z-10 animate-pulse" />

    {!isLast && (
      <div
        className="absolute left-[8px] top-[26px] w-px"
        style={{
          height: 'calc(100% + 8px)',
          background:
            'linear-gradient(to bottom, rgba(255,255,255,0.12), rgba(255,255,255,0.03))',
        }}
      />
    )}

    <div className="pt-2 pb-3 animate-pulse space-y-2">
      <div className="h-3.5 w-40 rounded bg-white/10" />
      <div className="h-2.5 w-24 rounded bg-white/[0.06]" />
    </div>
  </div>
);

const ExperienceItem = ({
  title,
  company,
  period,
  details,
  isLast,
}: ExperienceType & { isLast: boolean }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative pl-9">
      {/* Timeline dot */}
      <div className="absolute left-0 top-4 w-[18px] h-[18px] rounded-full border-2 border-[var(--accent-hover)]/50 bg-[var(--sidebar-bg)] flex items-center justify-center z-10">
        <div
          className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${open ? 'bg-[var(--accent-hover)]' : 'bg-[var(--accent)]/60'}`}
        />
      </div>

      {/* Connecting line to next item */}
      {!isLast && (
        <div
          className="absolute left-[8px] top-[26px] w-px"
          style={{
            height: open ? 'calc(100% - 10px)' : 'calc(100% + 8px)',
            background:
              'linear-gradient(to bottom, rgba(255,255,255,0.12), rgba(255,255,255,0.03))',
            transition: 'height 0.3s ease',
          }}
        />
      )}

      {/* Accordion header */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-start justify-between pt-2 pb-3 text-left hover:cursor-pointer group"
        aria-expanded={open}
      >
        <div className="flex flex-col min-w-0 pr-4">
          <span className="text-sm font-semibold text-foreground group-hover:text-white transition-colors">
            {title}
          </span>
          <span className="text-xs text-foreground/65 mt-0.5">{period}</span>
        </div>
        <FaChevronDown
          className={`mt-1 flex-shrink-0 text-foreground/30 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          size={12}
        />
      </button>

      {/* Collapsible details */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${open ? 'max-h-64 pb-6' : 'max-h-0'}`}
      >
        <p className="text-xs text-[var(--accent)]/80 italic mb-2">{company}</p>
        <ul className="space-y-1.5">
          {details.map((d) => (
            <li
              key={d}
              className="flex gap-2 text-sm text-foreground/65 leading-relaxed"
            >
              <span className="mt-1.5 block w-1 h-1 rounded-full bg-[var(--accent-hover)]/50 flex-shrink-0" />
              {d}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const Experience = () => {
  const { experiences, loading } = useExperience();

  return (
    <Section title="Experience" aria-label="Experience Section">
      <div className="relative flex flex-col">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <ExperienceItemSkeleton key={i} isLast={i === 3} />
            ))
          : experiences.map((exp, index) => (
              <ExperienceItem
                key={exp.company + exp.title}
                {...exp}
                isLast={index === experiences.length - 1}
              />
            ))}
      </div>
    </Section>
  );
};

export default Experience;
