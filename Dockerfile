# Use the FULL Node 18 (every other new version or even a "slimmer" 18, wouldn't work)
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install project dependencies
RUN npm install

# Install the needed node-libcurl package that couldn't be on my personal machine
RUN npm install node-libcurl

# Install Justin's CLI globally inside container
RUN npm install -g @jworkman-fs/wdv-cli

# Setup the test file for jest
RUN wdv-cli asl contacts-book setup:tests

# Copy the rest of the project files
COPY . .

# The assignment requires Express to run on port 8080
EXPOSE 8080

# Start the server
CMD ["npm", "start"]

# EXAMPLE BUILD: docker build --no-cache -t restful-routes .
# EXAMPLE RUN: docker run --rm -p 8080:8080 restful-routes
# GET INSIDE THE RUNNING CONTAINER & RUN TEST: 
    # $ docker ps       --> Copy the container's id or name
    # $ docker exec -it <container_id_or_name> sh
    # $ ls              --> NOTE: make sure you're in the project direcotry or 'cd' into it & ensure contacts.test.js is there
    #                   --> otherwise run this command again: wdv-cli asl contacts-book setup:tests
    #                   --> IMPORTANT: the command 'jest' DOES NOT WORK, instead use:
    # $ npm run test