import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";
import type { Container, Declaration, Rule } from "postcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      // --- MIN-WIDTH (Mobile-first - Ưu tiên dùng cái này) ---
      'xs': '375px',    // Mobile nhỏ
      'sm': '576px',    // Mobile lớn
      'md': '768px',    // Tablet
      'lg': '992px',    // Laptop nhỏ / Netbook
      'xl': '1280px',   // Desktop tiêu chuẩn
      '2xl': '1440px',  // Màn hình lớn
      '3xl': '1600px',  // Màn hình rất lớn
      '4xl': '1920px',  // Full HD / Monitor
      // --- MAX-WIDTH (Chỉ dùng khi thực sự cần "nghịch đảo" logic) ---
      'max-4xl': { max: '1919.98px' },
      'max-3xl': { max: '1599.98px' },
      'max-2xl': { max: '1439.98px' },
      'max-xl': { max: '1279.98px' },
      'max-lg': { max: '991.98px' },
      'max-md': { max: '767.98px' },
      'max-sm': { max: '575.98px' },
      'max-xs': { max: '374.98px' },
    },
    extend: {
      fontSize: {
        base: "16px",
      },
      fontFamily: {
        playfair: ["var(--font-playfair-display)", "serif"],
      },
    },
  },
  plugins: [
    plugin(function (api) {
      const { addVariant, postcss, theme } = api as unknown as {
        addVariant: (name: string, cb: ({ container }: { container: Container }) => void) => void;
        postcss: { decl: (decl: { prop: string; value: string }) => Declaration };
        theme: (path: string, defaultValue?: string) => unknown;
      };

      // "r" is shorthand for "rem"
      addVariant("r", ({ container }: { container: Container }) => {
        const baseFontSize = parseFloat(String(theme("fontSize.base", "16px")));

        container.walkRules((rule: Rule) => {
          const declarations: { prop: string; value: string }[] = [];

          rule.walkDecls((decl: Declaration) => {
            const pxValue = parseFloat(decl.value);
            if (!Number.isFinite(pxValue) || !decl.value.includes("px")) return;

            declarations.push({
              prop: decl.prop,
              value: `${pxValue / baseFontSize}rem`,
            });
          });

          rule.removeAll();
          declarations.forEach((declaration) => {
            rule.prepend(postcss.decl(declaration));
          });
        });
      });
    }),
  ],
};

export default config;
