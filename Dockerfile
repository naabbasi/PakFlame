############################
# STEP 1 build executable binary
############################
FROM golang:alpine AS builder
# Install git.
# Git is required for fetching the dependencies.
RUN apk update && apk add --no-cache git nodejs npm dep

WORKDIR /opt
RUN pwd
RUN mkdir -p AbuZarTraders

WORKDIR /opt/AbuZarTraders
COPY . .
RUN pwd
ENV GOPATH=/opt/AbuZarTraders
RUN ls -la /opt/AbuZarTraders/src/github.com/sanitary/
RUN cd src/github.com/sanitary/ && dep ensure && go build -o ../../../bin/AbuZarTrader github.com/sanitary/rest/main/

RUN cd src/github.com/sanitary/app && npm install && npm run build && mkdir -p ../../../bin/app/ && cp -r app/build/* ../../../bin/app/

RUN ls -la /opt/AbuZarTraders/bin

RUN /opt/AbuZarTraders/bin/AbuZarTrader
#RUN dep ensure
# Build the binary.
#RUN go build -o /go/bin/hello

############################
# STEP 2 build a small image
############################
#FROM scratch

# Copy our static executable.
#COPY --from=builder /go/bin/hello /go/bin/hello

# Run the hello binary.
#ENTRYPOINT ["/go/bin/hello"]
