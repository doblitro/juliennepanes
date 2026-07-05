'use client';

import React, { useEffect } from 'react';
import Navigation from './Navigation';
import Socials from './Socials';
import { FaDownload } from 'react-icons/fa';
import { FaXmark } from 'react-icons/fa6';
import { FiFileText } from 'react-icons/fi';

interface ResumeModalProps {
  open: boolean;
  onClose: () => void;
}

const ResumeModal: React.FC<ResumeModalProps> = ({ open, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-[90%] max-w-4xl h-4/5 md:h-[90%] bg-background rounded-xl overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center px-4 py-2 border-b border-border bg-background/90">
          <h2 className="text-lg font-semibold">Julienne&apos;s Resume</h2>
          <div className="flex gap-2">
            <a
              href="/api/resume"
              download
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-accent text-white hover:bg-accent-hover text-sm"
            >
              <FaDownload className="h-4 w-4" />
              Download
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-md hover:bg-white/10 transition"
            >
              <FaXmark className="h-5 w-5" />
            </button>
          </div>
        </div>

        <iframe
          src="/api/resume"
          title="Resume PDF Viewer"
          className="w-full h-full"
        />
      </div>
    </div>
  );
};

interface ResumeButtonProps {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const ResumeButton = ({ open, onOpen, onClose }: ResumeButtonProps) => {
  return (
    <>
      <button
        onClick={onOpen}
        className="w-full inline-flex items-center justify-center gap-2 p-4 rounded-md
          bg-transparent border-[1.5px] border-[var(--border)] from-[var(--accent)]
          to-[var(--accent-hover)] transition-all duration-300 text-[var(--accent-hover)]
          hover:translate-y-[-2px] hover:shadow-[var(--button-shadow-hover)] hover:cursor-pointer"
      >
        <FiFileText className="h-4 w-4" />
        <p className="text-sm uppercase tracking-widest font-extrabold">
          View Resume
        </p>
      </button>

      <ResumeModal open={open} onClose={onClose} />
    </>
  );
};

interface SidebarProps {
  resumeOpen: boolean;
  onResumeOpenChange: (open: boolean) => void;
}

const Sidebar = ({ resumeOpen, onResumeOpenChange }: SidebarProps) => {
  return (
    <div className="flex flex-col justify-between h-full px-7 py-9 md:py-12">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
          Julienne Panes
        </h1>
        <p className="font-semibold text-xs text-white/20 uppercase tracking-wide">
          Full-Stack Software Developer
        </p>
        {/* Availability badge */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2 flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          <span className="text-xs text-green-500 font-medium">
            Open to work
          </span>
        </div>
        <div className="mt-1">
          <ResumeButton
            open={resumeOpen}
            onOpen={() => onResumeOpenChange(true)}
            onClose={() => onResumeOpenChange(false)}
          />
        </div>
      </div>

      <div className="flex-1 flex justify-start items-center py-10">
        <Navigation />
      </div>

      <div className="border-t border-white/[0.07] pt-5">
        <Socials />
      </div>
    </div>
  );
};

export default Sidebar;
