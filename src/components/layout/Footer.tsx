import { APP_LOGO_SRC, APP_NAME } from "@/config";

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "Quizzes", href: "/quizzes" },
  { label: "About", href: "/about" },
];

const Footer = () => {
  return (
    <footer className="border-t border-border/40 bg-background relative overflow-hidden">
      {/* Subtle top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px"
        style={{ background: "linear-gradient(90deg, transparent, hsla(270, 66%, 35%, 0.4), hsla(43, 72%, 52%, 0.3), transparent)" }} />

      <div className="container mx-auto px-4 md:px-8 py-14">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="font-display text-xl font-bold tracking-wider">
              <span className="inline-flex items-center gap-2">
                <img
                  src={APP_LOGO_SRC}
                  alt={APP_NAME}
                  className="h-8 w-8 rounded-md object-cover ring-1 ring-border/40"
                />
                <span className="text-gradient-gold">{APP_NAME}</span>
              </span>
            </h3>
          </div>

          <div className="flex items-center gap-8">
            {footerLinks?.map((link) => (
              <a
                key={link?.label}
                href={link?.href}
                className="text-sm text-muted-foreground hover:text-accent transition-colors duration-300"
              >
                {link?.label}
              </a>
            ))}
          </div>

          {/* Social placeholders */}
          <div className="flex items-center gap-3">
            {["Twitter", "Instagram", "YouTube"]?.map((name) => (
              <div
                key={name}
                className="w-9 h-9 rounded-full border border-border/50 flex items-center justify-center text-xs text-muted-foreground hover:border-accent/60 hover:text-accent transition-all duration-300 cursor-pointer hover:bg-accent/5"
              >
                {name?.[0]}
              </div>
            ))}
          </div>
        </div>

        <div className="section-divider mt-10 mb-6" />

        <p className="text-xs text-muted-foreground/70 text-center max-w-xl mx-auto leading-relaxed">
          This is a fan-made Harry Potter website and is not affiliated with Warner Bros or J.K. Rowling.
          All trademarks belong to their respective owners.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
