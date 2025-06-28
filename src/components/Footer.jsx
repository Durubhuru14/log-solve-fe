import {
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaYoutube,
  FaDiscord,
} from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { MdOutlineAlternateEmail } from "react-icons/md";

const socialLinks = [
  {
    id: "1",
    title: "Github",
    icon: <FaGithub />,
    url: "https://github.com/Durubhuru14/",
  },
  {
    id: "2",
    title: "LinkedIn",
    icon: <FaLinkedin />,
    url: "https://www.linkedin.com/in/durvesh-more",
  },
  {
    id: "3",
    title: "Instagram",
    icon: <FaInstagram />,
    url: "https://instagram.com/durubhuru",
  },
  {
    id: "4",
    title: "Discord",
    icon: <FaDiscord />,
    url: "https://discord.com/users/1016592999234412585",
  },
  {
    id: "5",
    title: "Twitter/X.com",
    icon: <FaSquareXTwitter />,
    url: "https://x.com/durubhuru",
  },
  {
    id: 6,
    title: "Youtube",
    icon: <FaYoutube />,
    url: "https://www.youtube.com/channel/UC3-OIF4VhSWFk-Dr3FALGHw",
  },
  {
    id: 8,
    title: "E-mail",
    icon: <MdOutlineAlternateEmail />,
    url: "mailto:durveshmore.drm@gmail.com",
  },
];

const Footer = () => {
  return (
    <footer className="justify-center text-center">
      <p className="text-gray-100/90 xl:text-lg 2xl:text-xl">
        created with 💖 by <span className="text-signature">Durubhuru@{new Date().getFullYear()}</span>
      </p>
      <div className="flex justify-center gap-3 text-2xl md:text-3xl my-2">
        {socialLinks.map((socialLink) => {
          const { id, title, icon, url } = socialLink;
          return <a key={id} href={url} title={title} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-blue-500">{icon}</a>
        })}
      </div>
    </footer>
  );
};
export default Footer;
