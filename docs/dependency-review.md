# Dependency review

The baseline audit reported 60 affected package entries (4 critical, 23 high, 28 moderate, 5 low). After upgrading Next/React/Sanity and removing redundant packages, the clean lockfile reports 21 moderate entries, zero high and zero critical findings.

Three same-major transitive overrides pin compatible security fixes: js-yaml 3.15.2, smol-toml 1.9.1 and Undici 7.30.1. Keep them until upstream ranges include the fixes; verify builds/tests when removing them.

The remaining entries trace to minimatch globparts amplification (GHSA-g3hv-75wg-m249), through Sanity's CLI tools and TypeScript ESLint tooling. Current affected transitive versions are majors below the fixed minimatch 11.0.1. A forced major override or downgrade of the supported Next/Sanity integration is not applied. This site does not accept visitor-provided glob patterns, but operators should not run these CLI tools against untrusted configuration. Track upstream fixes and revisit before each dependency maintenance release. These are advisory matches, not proven public-site exploits.

ESLint 9 is retained because current Next lint plugins declare peers through version 9; version 10 produced incompatible peer warnings. Upgrade the lint stack together when its plugins support a current ESLint major. This development-tool constraint does not justify forcing peers.

Public route code uses no Chakra, Emotion, Framer Motion, react-icons, Lucide, Axios, Nodemailer or datepicker. Runtime direct dependencies decreased from 22 to 11. Updated embedded Studio still brings a substantial transitive dependency tree, so this change does not claim the whole installed tree is smaller. Separating Studio is a future operational tradeoff, not part of the public UI rewrite.

Final machine-readable report from this workspace: `/tmp/nyan-audit-final.json`. Regenerate it with `npm audit --json`; counts and advisories can change.
