FROM golang:alpine AS builder

ENV GOOS=linux \
    GOARCH=amd64

WORKDIR /build
COPY . ./

RUN go mod download
RUN go build -o main .

WORKDIR /dist
RUN cp /build/main .

###

FROM scratch

EXPOSE 8000

WORKDIR /app
COPY --from=builder /dist/main .

ENTRYPOINT ["./main"]