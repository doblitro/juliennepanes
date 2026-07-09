import Link from 'next/link';
import { FaEnvelope, FaGithub, FaLinkedin } from 'react-icons/fa';

type SocialsListType = {
  name: string;
  icon: React.ReactNode;
  href: string;
};

const SocialsList: SocialsListType[] = [
  {
    name: 'GitHub',
    icon: <FaGithub />,
    href: 'https://github.com/doblitro',
  },
  {
    name: 'LinkedIn',
    icon: <FaLinkedin />,
    href: 'https://www.linkedin.com/in/julienne-andrea-panes-99456024a',
  },
  {
    name: 'Mail',
    icon: <FaEnvelope />,
    href: 'mailto:juliennepanes@gmail.com?subject=I%20need%20aSoftware%20Developer',
  },
];

const Socials = () => {
  return (
    <ul className="flex gap-4 w-full justify-end md:justify-start">
      {SocialsList.map((social: SocialsListType, index: number) => (
        <li key={social.name ?? index}>
          <Link
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.name}
            className="inline-block transform transition duration-300 ease-in-out
                            hover:-translate-y-1 hover:shadow-[var(--button-shadow-hover)]
                            hover:cursor-pointer"
          >
            {social.icon ?? social.name}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default Socials;
