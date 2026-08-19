# Official Playwright image: ships Node + Chromium + all system libraries
# Playwright and browser versions MUST stay in sync (package.json: 1.62.1).
FROM mcr.microsoft.com/playwright:v1.62.1-noble

WORKDIR /app

# Copy manifests first for better layer caching.
COPY package.json package-lock.json ./

# Browsers are already bundled in this image, so skip the postinstall download.
# sharp ships prebuilt binaries via optionalDependencies — no scripts needed.
RUN npm ci --ignore-scripts --omit=dev

COPY . .

ENV NODE_ENV=production
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
# REQUIRED in production — set to your deployed API host, e.g.
#   PUBLIC_BASE_URL=https://your-api.example.com
# Without this, screenshot markdown links will point to a dead domain.
# ENV PUBLIC_BASE_URL=

EXPOSE 8787

CMD ["node", "src/server.js"]
