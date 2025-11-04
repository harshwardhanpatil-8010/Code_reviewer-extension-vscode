FROM node:18-alpine

# This Dockerfile creates a build environment for a VSCode extension.
# It assumes a package.json exists with dependencies like 'axios' and devDependencies like 'vsce'.

WORKDIR /app

# Install the VSCode Extension packaging tool globally
RUN npm install -g vsce

# Copy package files and install dependencies
# This leverages Docker's layer caching
COPY package*.json ./
RUN npm install

# Copy the rest of the application source code
COPY . .

# Set a default command to package the extension.
# This will generate a .vsix file in the WORKDIR.
CMD ["vsce", "package"]