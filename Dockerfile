FROM node:latest

# Install latest chrome dev package and fonts to support major charsets (Chinese, Japanese, Arabic, Hebrew, Thai and a few others)
# Note: this installs the necessary libs to make the bundled version of Chromium that Puppeteer
# installs, work.
RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-khmeros fonts-kacst fonts-freefont-ttf libxss1 \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd -r pptruser && useradd -rm -g pptruser -G audio,video pptruser

USER pptruser

WORKDIR /home/pptruser

# COPY puppeteer-latest.tgz puppeteer-core-latest.tgz ./

# Install puppeteer and puppeteer-core into /home/pptruser/node_modules.
RUN npm i ./puppeteer-core-latest.tgz ./puppeteer-latest.tgz \
    && rm ./puppeteer-core-latest.tgz ./puppeteer-latest.tgz \
    && (node -e "require('child_process').execSync(require('puppeteer').executablePath() + ' --credits', {stdio: 'inherit'})" > THIRD_PARTY_NOTICES)

COPY package*.json ./
RUN npm install .
COPY . .
RUN cp Injected.js node_modules\whatsapp-web.js\src\util\Injected.js -f

# Run everything after as non-privileged user.
# RUN useradd -ms /bin/bash wppuser
# USER wppuser

CMD ["node", "app.js"]