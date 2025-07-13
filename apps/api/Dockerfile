#? =-=-=-=-=-=- Base Stage =-=-=-=-=-=-

FROM node:alpine AS base

# update dependencies of image
RUN apk update

# set working directory
WORKDIR /app

# set available environment variables
ENV NODE_ENV=production \
  # apps/api
  APPS_API_PORT=4000 \
  APPS_API_PREFIX="" \
  APPS_API_ORIGIN="*" \
  # apps/api/resources/coin
  APPS_API_RESOUCES_COIN_CRON="*/30 * * * *" \
  APPS_API_RESOUCES_COIN_RUN_ON_START=false \
  # packages/nest-auth
  PACKAGES_NEST_COMMON_BASE_URL="http://localhost:$APPS_API_PORT}" \
  PACKAGES_NEST_COMMON_JWT_PRIVATE_KEY="secret" \
  PACKAGES_NEST_COMMON_JWT_PUBLIC_KEY="secret" \
  PACKAGES_NEST_COMMON_JWT_ALGORITHM="HS256" \
  PACKAGES_NEST_COMMON_JWT_AUDIENCE="https://www.truther.to/" \
  PACKAGES_NEST_COMMON_JWT_ISSUER="truther-coinbase" \
  PACKAGES_NEST_COMMON_JWT_EXPIRES="10m" \
  PACKAGES_NEST_MICROSOFT_CLIENT_ID="" \
  PACKAGES_NEST_MICROSOFT_CLIENT_SECRET="" \
  PACKAGES_NEST_GOOGLE_CLIENT_ID="" \
  PACKAGES_NEST_GOOGLE_CLIENT_SECRET="" \
  PACKAGES_NEST_SESSION_ACCESS_TTL="10m" \
  PACKAGES_NEST_SESSION_REFRESH_TTL="14d" \
  # packages/nest-cache
  PACKAGES_NEST_CACHE_URL="redis://localhost:$DOCKER_REDIS_PORT/0" \
  PACKAGES_NEST_CACHE_KEY="cache" \
  PACKAGES_NEST_CACHE_REQUEST_KEY="request" \
  # packages/nest-coingecko-api
  PACKAGES_NEST_COINGECKO_API_BASE_URL="https://api.coingecko.com/api/v3" \
  PACKAGES_NEST_COINGECKO_API_HEADER="x-cg-demo-api-key" \
  PACKAGES_NEST_COINGECKO_API_KEY="" \
  PACKAGES_NEST_COINGECKO_API_VS_CURRENCY="usd" \
  # packages/nest-crypto
  PACKAGES_NEST_CRYPTO_KEY="aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" \
  # packages/nest-database
  PACKAGES_NEST_DATABASE_URL="postgres://postgres:postgres@localhost:5432/postgres" \
  PACKAGES_NEST_DATABASE_LOGGING=false \
  PACKAGES_NEST_DATABASE_MIGRATE=true \
  PACKAGES_NEST_DATABASE_DEFAULT_LIMIT=50 \
  PACKAGES_NEST_DATABASE_MOCKUPS=false

# install pnpm to build and run packages
RUN npm i -g pnpm

#? =-=-=-=-=-=- Builder Stage =-=-=-=-=-=-

FROM base AS builder

# copy all source files to image
COPY . .

# prepare project using prune
RUN pnpm dlx turbo prune --scope=api --docker

#? =-=-=-=-=-=- Installer Stage =-=-=-=-=-=-

FROM base AS installer

# copy ouput files from builder stage (need to copy tools/dev to run custom scripts)
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/full/tools/dev/ ./tools/dev/ 
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/turbo.json ./turbo.json

# install required packages
RUN pnpm install --frozen-lockfile

#? =-=-=-=-=-=- Compiler Stage =-=-=-=-=-=-

FROM base AS compiler

# copy installed packages, application source code
COPY --from=installer /app/ .
COPY --from=builder /app/out/full/ .
COPY .gitignore .gitignore

# build project
RUN pnpm dlx turbo build --filter=api

#? =-=-=-=-=-=- Runner Stage =-=-=-=-=-=-

FROM node:alpine AS runner

# copy compiled sources to final image
COPY --from=compiler /app/ .

# create non-root user and group
RUN addgroup --system --gid 1001 cdoc \
  && adduser --system --uid 1001 --ingroup cdoc cdoc

# define to use non-root user
USER cdoc

# exposes the aplication port
EXPOSE ${APPS_BACKEND_CPG_PORT}

# start main script of project
CMD [ "node", "apps/api/dist/main.js" ]
