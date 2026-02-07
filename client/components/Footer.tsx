import Image from "next/image";
import { IMAGES } from "@/lib/paths";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-gray-950 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <Image
                src={IMAGES.ICON}
                alt="CV Builder"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <span className="text-lg font-bold text-white">CV Builder</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Create professional resumes that get you hired.
            </p>
          </div>
          {[
            {
              title: "Product",
              links: ["Templates", "Features", "Pricing", "Examples"],
            },
            {
              title: "Company",
              links: ["About", "Blog", "Careers", "Contact"],
            },
            {
              title: "Legal",
              links: ["Privacy", "Terms", "Security", "GDPR"],
            },
          ].map((group) => (
            <div key={group.title}>
              <h4 className="text-sm font-semibold text-white mb-3">
                {group.title}
              </h4>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link}>
                    <button className="text-sm text-gray-500 hover:text-emerald-400 transition-colors">
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/5 pt-8 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} CV Builder. All rights reserved.
        </div>
      </div>
    </footer>
  );
}