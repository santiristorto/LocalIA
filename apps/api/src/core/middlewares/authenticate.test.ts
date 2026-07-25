import type { NextFunction, Request, Response } from "express";
import { beforeAll, describe, expect, it, vi } from "vitest";
import type { JWTVerifyGetKey } from "jose";

import { createAuthenticate } from "./authenticate.js";
import { UnauthenticatedError } from "../errors/index.js";
import { getTestJWKS, signTestJwt } from "../../test-utils/sign-test-jwt.js";

function buildMockReq(authorizationHeader?: string): Request {
  return {
    header: (name: string) =>
      name.toLowerCase() === "authorization" ? authorizationHeader : undefined,
    log: { warn: vi.fn() },
  } as unknown as Request;
}

describe("authenticate", () => {
  let authenticate: ReturnType<typeof createAuthenticate>;

  beforeAll(async () => {
    const testJWKS: JWTVerifyGetKey = await getTestJWKS();
    authenticate = createAuthenticate(testJWKS);
  });

  it("llama a next() con un error de autenticación si falta el header Authorization", async () => {
    const req = buildMockReq(undefined);
    const next = vi.fn() as unknown as NextFunction;

    await authenticate(req, {} as Response, next);

    expect(next).toHaveBeenCalledWith(expect.any(UnauthenticatedError));
  });

  it("llama a next() con un error de autenticación si el token es inválido", async () => {
    const req = buildMockReq("Bearer token-invalido");
    const next = vi.fn() as unknown as NextFunction;

    await authenticate(req, {} as Response, next);

    expect(next).toHaveBeenCalledWith(expect.any(UnauthenticatedError));
  });

  it("rechaza un JWT válido pero firmado con una clave que no está en el JWKS", async () => {
    // Simula el escenario real que reportó el usuario: un token firmado con
    // un algoritmo/clave que el verificador no reconoce.
    const { SignJWT, generateKeyPair } = await import("jose");
    const { privateKey } = await generateKeyPair("ES256");
    const rogueToken = await new SignJWT({})
      .setProtectedHeader({ alg: "ES256", kid: "clave-no-publicada" })
      .setSubject("user-123")
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(privateKey);

    const req = buildMockReq(`Bearer ${rogueToken}`);
    const next = vi.fn() as unknown as NextFunction;

    await authenticate(req, {} as Response, next);

    expect(next).toHaveBeenCalledWith(expect.any(UnauthenticatedError));
  });

  it("adjunta req.user y llama a next() sin argumentos si el token es válido", async () => {
    const token = await signTestJwt({
      sub: "user-123",
      email: "marina@ejemplo.com",
      fullName: "Marina Gómez",
    });
    const req = buildMockReq(`Bearer ${token}`);
    const next = vi.fn() as unknown as NextFunction;

    await authenticate(req, {} as Response, next);

    expect(next).toHaveBeenCalledWith();
    expect(req.user).toEqual({
      id: "user-123",
      email: "marina@ejemplo.com",
      fullName: "Marina Gómez",
    });
  });
});
