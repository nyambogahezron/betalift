
# Use bun image for base image for all stages.
FROM oven/bun:1-alpine as base
WORKDIR /usr/src/app

# Create a stage for installing production dependencies.
FROM base as deps
# Download dependencies as a separate step to take advantage of Docker's caching.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=bun.lock,target=bun.lock \
    bun install --production

# Create a stage for building the application.
FROM deps as build
# Install all dependencies (including dev) for building
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=bun.lock,target=bun.lock \
    bun install

# Copy the rest of the source files into the image.
COPY . .
# Run the build script.
RUN bun run build

# Create a new stage to run the application with minimal runtime dependencies
FROM base as final

# Use production node environment by default.
ENV NODE_ENV production

# Run the application as a non-root user.
USER bun

# Copy package.json so that package manager commands can be used.
COPY package.json .

# Copy the production dependencies from the deps stage and also
# the built application from the build stage into the image.
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

# Expose the port that the application listens on.
EXPOSE 5173

# Run the application.
CMD ["bun", "run", "preview", "--port", "5173", "--host"]
